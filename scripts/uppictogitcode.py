#!/usr/bin/env python3
"""
Pic‑Git：安全的 GitCode 图床批量上传工具
• 使用 PyYAML 处理 frontmatter 中的图片引用
• 同时处理正文里的 Markdown / HTML 图片引用
• 通过 Git 推送到本地仓库，自动获取 raw 链接
• 替换后可选择删除原始图片文件
"""

import sys
import re
import shutil
import subprocess
from pathlib import Path
import yaml

print("请不要在已经存在的仓库根目录下运行这个脚本！")


# ---------- 基本配置 ----------
IMG_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico'}
IMG_FM_KEYS = {'image', 'photos', 'images', 'pictures', 'gallery'}

# 正文图片正则
MD_IMG = re.compile(r'!\[.*?\]\(([^)]+)\)')
HTML_IMG = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)


def is_local(url: str) -> bool:
    return not (url.startswith('http://') or url.startswith('https://'))


def is_image(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in IMG_EXT


# ---------- Git 操作 ----------
def git(*args, repo: Path, timeout: int = 300):
    return subprocess.run(
        ['git', '-C', str(repo)] + list(args),
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def git_push(repo: Path, msg: str = "upload by pic-git"):
    if git("add", ".", repo=repo).returncode != 0:
        print("  ❌ git add 失败")
        return
    r = git("commit", "-m", msg, repo=repo)
    if r.returncode != 0 and "nothing to commit" not in r.stdout + r.stderr:
        print("  ❌ git commit 失败")
        return
    if git("push", repo=repo, timeout=600).returncode != 0:
        print("  ❌ git push 失败（可稍后手动推送仓库）")
        return
    print("  ✅ 推送成功")


# ---------- 图片上传（复制到本地仓库） ----------
def upload_one(
    original_path: str,
    md_dir: Path,
    repo_path: Path,
    remote_info: dict,
    cache: dict,
    dry_run: bool,
) -> str:
    """上传一张图片，返回远程 URL"""
    target = (md_dir / original_path).resolve()
    if not is_image(target):
        return original_path  # 不是图片，保留原路径

    if target in cache:
        return cache[target]

    # 新文件名 = 父目录_原文件名
    new_name = f"{md_dir.name}_{target.name}"
    dest = repo_path / remote_info['images_folder'] / new_name
    if not dry_run:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(target, dest)

    remote_file = f"{remote_info['images_folder']}/{new_name}"
    url = f"https://raw.gitcode.com/{remote_info['owner']}/{remote_info['repo']}/raw/{remote_info['branch']}/{remote_file}"
    cache[target] = url
    return url


# ---------- 替换 frontmatter 中的图片（PyYAML） ----------
def replace_fm_images(data, md_dir, repo_path, remote_info, cache, dry_run):
    """递归遍历 Python 对象，将本地图片路径替换为远程 URL"""
    if isinstance(data, dict):
        for k, v in data.items():
            if k in IMG_FM_KEYS:
                if isinstance(v, str) and is_local(v):
                    data[k] = upload_one(
                        v, md_dir, repo_path, remote_info, cache, dry_run
                    )
                elif isinstance(v, list):
                    new_list = []
                    for item in v:
                        if isinstance(item, str) and is_local(item):
                            new_list.append(
                                upload_one(
                                    item, md_dir, repo_path, remote_info, cache, dry_run
                                )
                            )
                        else:
                            new_list.append(item)
                    data[k] = new_list
            else:
                if isinstance(v, (dict, list)):
                    replace_fm_images(v, md_dir, repo_path, remote_info, cache, dry_run)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, (dict, list)):
                replace_fm_images(item, md_dir, repo_path, remote_info, cache, dry_run)
            elif isinstance(item, str) and is_local(item):
                data[i] = upload_one(
                    item, md_dir, repo_path, remote_info, cache, dry_run
                )


# ---------- 替换正文中的图片（正则） ----------
def replace_body_images(
    text: str,
    md_dir: Path,
    repo_path: Path,
    remote_info: dict,
    cache: dict,
    dry_run: bool,
) -> str:
    """替换 ![alt](path) 和 <img src="path"> 中的本地路径"""

    def repl_md(match):
        path = match.group(1)
        if is_local(path):
            url = upload_one(path, md_dir, repo_path, remote_info, cache, dry_run)
            return match.group(0).replace(path, url)
        return match.group(0)

    def repl_html(match):
        path = match.group(1)
        if is_local(path):
            url = upload_one(path, md_dir, repo_path, remote_info, cache, dry_run)
            return match.group(0).replace(path, url)
        return match.group(0)

    text = MD_IMG.sub(repl_md, text)
    text = HTML_IMG.sub(repl_html, text)
    return text


# ---------- 处理单个文件 ----------
def process_file(
    md_file: Path,
    repo_path: Path,
    remote_info: dict,
    cache: dict,
    dry_run: bool,
    verbose: bool,
):
    original = md_file.read_text(encoding='utf-8')

    # 1. 分离 frontmatter 和正文
    parts = original.split('---', 2)
    if len(parts) < 3 or not original.startswith('---'):
        print("  ⚠️ 无 frontmatter，将只处理正文图片")
        front_raw = None
        body = original
    else:
        front_raw = parts[1]
        body = parts[2]

    # 2. 处理 frontmatter
    if front_raw is not None:
        try:
            fm_data = yaml.safe_load(front_raw)
            if fm_data is None:
                fm_data = {}
            if not dry_run:
                replace_fm_images(
                    fm_data, md_file.parent, repo_path, remote_info, cache, dry_run
                )
            new_front = yaml.dump(
                fm_data, allow_unicode=True, sort_keys=False, width=float('inf')
            ).strip()
            new_text = f"---\n{new_front}\n---{body}"
        except Exception as e:
            print(f"  ❌ YAML 解析失败，跳过 frontmatter 处理: {e}")
            new_text = original
    else:
        new_text = original

    # 3. 处理正文图片（基于 new_text 的 body 部分）
    if not dry_run:
        if front_raw is not None:
            # 重新分离一次（因为 frontmatter 可能变化）
            parts2 = new_text.split('---', 2)
            body_part = parts2[2] if len(parts2) >= 3 else new_text
            new_body = replace_body_images(
                body_part, md_file.parent, repo_path, remote_info, cache, dry_run
            )
            new_text = f"---\n{new_front}\n---{new_body}"
        else:
            new_text = replace_body_images(
                new_text, md_file.parent, repo_path, remote_info, cache, dry_run
            )

    # 4. 写回文件
    if new_text != original:
        if not dry_run:
            md_file.write_text(new_text, encoding='utf-8')
        if verbose:
            print("  ✅ 已保存修改")
    else:
        if verbose:
            print("  ℹ️ 无变化")


# ---------- 删除原始图片 ----------
def delete_original_files(cache: dict):
    """删除已上传且已替换的所有原始图片文件"""
    count = 0
    for local_path in cache.keys():
        try:
            local_path.unlink()
            print(f"  🗑️  已删除: {local_path}")
            count += 1
        except FileNotFoundError:
            print(f"  ⚠️  文件已不存在: {local_path}")
        except Exception as e:
            print(f"  ❌ 删除失败 {local_path}: {e}")
    if count:
        print(f"  ✅ 共删除 {count} 个原始图片文件")
    else:
        print("  ℹ️  没有需要删除的图片")


# ---------- 主流程 ----------
def main():
    print("=== Pic‑Git 安全图床工具 ===\n")
    owner = input("GitCode 用户名: ").strip()
    repo = input("仓库名: ").strip()
    token = input("私人令牌: ").strip()
    branch = input("分支 (默认 main): ").strip() or "main"
    imgs = input("图片目录 (默认 images): ").strip() or "images"

    # 初始化本地仓库
    local_repo = Path.cwd() / repo
    if not (local_repo / ".git").exists():
        clone_url = f"https://oauth2:{token}@gitcode.com/{owner}/{repo}.git"
        try:
            subprocess.run(["git", "clone", clone_url, str(local_repo)], check=True)
            print("✅ 克隆成功")
        except Exception as e:
            sys.exit(f"❌ 克隆失败: {e}")
    else:
        subprocess.run(
            [
                "git",
                "-C",
                str(local_repo),
                "remote",
                "set-url",
                "origin",
                f"https://oauth2:{token}@gitcode.com/{owner}/{repo}.git",
            ]
        )

    root_str = input("Markdown 根目录: ").strip().strip('"')
    root = Path(root_str)
    if not root.is_dir():
        sys.exit("❌ 目录不存在")

    verbose = input("显示详细过程? (y/n): ").lower() == 'y'
    dry_run = input("预览模式? (y/n): ").lower() == 'y'

    remote_info = {
        'owner': owner,
        'repo': repo,
        'branch': branch,
        'images_folder': imgs,
    }
    cache = {}
    md_files = sorted(root.rglob("*.md"))
    print(f"\n📂 找到 {len(md_files)} 个文件\n")

    for i, f in enumerate(md_files, 1):
        rel = f.relative_to(root)
        print(f"[{i}/{len(md_files)}] {rel}")
        process_file(f, local_repo, remote_info, cache, dry_run, verbose)

    if not dry_run:
        print("\n📤 提交并推送...")
        git_push(local_repo)
        # 推送成功后，询问是否删除原始图片
        if cache:
            print(f"\n本次共上传 {len(cache)} 张图片。")
            del_confirm = input("是否删除原始图片文件？(y/n): ").strip().lower()
            if del_confirm == 'y':
                delete_original_files(cache)
    else:
        print("\n[dry‑run] 不会实际推送或删除文件")
    print(f"\n✅ 全部完成。")
    input("按回车退出...")


if __name__ == '__main__':
    main()
