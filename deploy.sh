#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 将githubaction 和 Dockerfile移动过来
cd docs/.vuepress/docker
cp -R . ../dist

# 进入生成的文件夹
cd ../dist


git init
git add -A
git commit -m 'deploy'

# # 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:lemoba/lemoba.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -