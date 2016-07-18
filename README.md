## 工具介绍
工具主要用于二倍图自动生成sprite
## 下面举个例子
### 目录结构
-static 
    -dest
        -imgs
            -2x
            -1x
            -sprite
        -css
            -index.css
-gulp
    gulputil.js

### 代码示例
`
/*缩略图*/
gulp.task('thumbnailtask', function () {
    return gulp.src('../static/dest/imgs/2x/*.png')
        .pipe(thumbnail("../1x"));
});
/*图片位置map*/
gulp.task('fileMap',["thumbnailtask"], function () {
    return gulp.src('../static/dest/imgs/2x/*.png').pipe(sprite.fileMap());
});
/*生成sprite*/
gulp.task('spritetask', ["sasstask", "fileMap"], function () {
    sprite.createSprite(function () {
        gulp.src('../static/dest/css/*.css')
            .pipe(postcss([
                require('postcss-jingoal-sprite')
            ]))
            .pipe(gulp.dest('../static/dest/css'));
    });
});
`
### 思路说明
* 先通过 gulp-jingoal-thumbnail 将2x里面的二倍图图片转化成1倍图
* 通过 jingoal-sprite 浏览2x里面所有的图片, 抢图片合并成一张图片并且记下图片的位置, 已经长宽, 会在static/dest/imgs/sprite 下面生成3个文件 2x.png 1x.png map.json
* 最后通过本插件 分析 static/dest/css/index.css 里面 background:url(.*), 或者background-image: url(.*); 将这些代码替换成background-position  并自动加上宽高

## 备注

图片精灵的公共样式
`
@mixin image_set($url, $suffix:"png") {
    display: inline-block;
    background-image:url(#{$url}1x.#{$suffix});
    background-image: -webkit-image-set(url(#{$url}1x.#{$suffix}) 1x, url(#{$url}2x.#{$suffix}) 2x);
    background-image: -moz-image-set(url(#{$url}1x.#{$suffix}) 1x, url(#{$url}2x.#{$suffix}) 2x);
    background-image: -ms-image-set(url(#{$url}1x.#{$suffix}) 1x, url(#{$url}2x.#{$suffix}) 2x);
    background-image: -o-image-set(url(#{$url}1x.#{$suffix}) 1x, url(#{$url}2x.#{$suffix}) 2x);
    background-image: image-set(url(#{$url}1x.#{$suffix}) 1x, url(#{$url}2x.#{$suffix}) 2x);
    background-repeat: no-repeat;
    _background-image: url(#{$url}1x.#{$suffix});
}
i[class*='icon-'] {
    @include image_set("../imgs/sprite/", "png");
    background-size: auto!important;
}

`
调试的时候 可以将图片用原始的方式进行书写
`
.icon-arrow-down {
    background-image: url(../imgs/1x/icon-arrow-down.png)!important;
    width: 16px;
    height: 16px;
}
`

