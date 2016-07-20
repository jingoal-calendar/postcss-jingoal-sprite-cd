var postcss = require('postcss');
var path = require('path');
var fs = require('fs');
//require("./checkRules.js");
module.exports = postcss.plugin('postcss-jingoal-sprite-cd', function (opts) {
  opts = opts || {};
  return function (css,result) {
    var cssUrl = path.dirname(css.source.input.file);
    var spriteMap = JSON.parse(fs.readFileSync(cssUrl+"/../imgs/sprite/map.json"));
    css.walkRules(function (rule) {
      rule.walkDecls(/background/, function (decl) {
        var imgUrlReg = /url\(['"]?(.*)\1?\)/;
        var result = imgUrlReg.exec(decl.value);
        if(result){
          var imgSrc = path.resolve(cssUrl+"\\"+result[1]).replace(/\\/g, "/");
          if(spriteMap[imgSrc]){
            var spriteValue = spriteMap[imgSrc];
            decl.replaceWith({prop:"background-position",value:["-",spriteValue.x,"px -",spriteValue.y,"px"].join("")});
            rule.walkDecls(/width|height/, function (childdecl) {
              if(childdecl.prop=="width"){
                childdecl.replaceWith({prop:"width",value:spriteValue.width/2+"px"});
              }else{
                childdecl.replaceWith({prop:"height",value:spriteValue.height/2+"px"});
              }
            });
          }
        }
      });
    });
  };
});
