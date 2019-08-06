# 用Docker部署一个Node应用
___

![avatar](https://img.shields.io/badge/Docker-17.12.1.ce-blue.svg)
![avatar](https://img.shields.io/badge/Linux-CentOS7-blue.svg)
![avatar](https://img.shields.io/badge/Node-v10.15.0-blue.svg) ![avatar](https://img.shields.io/badge/Koa-v2.7.0-blue.svg) 

> 1. 制作自己的Docker容器
> 2. 用Docker部署

## 什么是Docker?
    打个比方：你如果想玩英雄联盟中骚气的亚索，你首先得有这个英雄（Docker的镜像），然后你得花金币去英雄商店（Docker的仓库）买，接着进游戏就会看到一个半蹲的发型飘逸的剑客（Docker的容器）

    Docker由仓库(Repository)、镜像(Image)、容器(Container)组成。

## 安装Docker
1. 更新yum包
```bash
yum update
```

2. 设置yum源
```bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

3. 可以查看所有仓库中所有docker版本，并选择特定版本安装
```bash
yum list docker-ce --showduplicates | sort -r
```

4. 选择版本进行安装
```bash
yum install docker-ce-17.12.1.ce
```

5. 启动Docker
```bash
systemctl start docker
```

6. 验证安装是否成功(有client和service两部分表示docker安装启动都成功了)
```bash
docker version
```

## 制作自己的 Docker 容器
1. Dockerfile文件
```
FROM node:10.15.0
# 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
COPY . /app
# 指定接下来的工作路径为/app
WORKDIR /app
RUN npm install
# 将容器 3000 端口暴露出来， 允许外部连接这个端口
EXPOSE 3000
CMD ["npm", "start"]
```

2. 创建image
```bash
docker image build -t koa-demo:0.0.1 .
```
    -t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest
    最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点

3. 列出所有镜像
```bash
docker image ls
```
    可以看到我们刚才创建的koa-demo镜像了

4. 启动容器
```bash
docker container run -p 8000:3000 -it koa-demo:0.0.1
```
    -p参数：容器的 3000 端口映射到本机的 8000 端口。
    -it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器
    koa-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）

5. 浏览器访问
```
localhost:8000
```

## 其它命令
```bash
# 在仓库下载镜像
$ docker image pull library/hello-world
# 列出所有镜像
$ docker image ls
$ docker image ls --all
# 删除 image 文件
$ docker image rm [imageName]
# 列出本机正在运行的容器
$ docker container ls
# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
# 终止某容器
$ docker container kill [containID]
# 删除某容器，释放磁盘空间
$ docker container rm [containerID]
```

## 参考资料
1. [Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
2. [Centos7下安装Docker（详细的新手装逼教程）](https://www.cnblogs.com/qgc1995/p/9553572.html)
3. [Get Docker Engine - Community for CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)