var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xml2js = require('xml2js');
var xml2js_param = {
  explicitArray: false,
  explicitCharkey: true,
  explicitAttrkey: true,
  charkey: '_value',
  attrkey: '_attr',
  trim: true,
}

var WRAPPER_LIMIT = 5;
var count = 1;
var vast2json = {};


vast2json.toJson = function(req,callback){

  var self = this;
  if(req.indexOf('http') === 0){
    self.fetch(req, function(doc){
      self.parse(doc,callback);
    }, function(e) {callback(e)});
  }else{
    self.parse(req,callback);
  } 
}
  
vast2json.parse = function(str,callback){

  var self = this;
  self.xmlparse(str, function(json){
    if( ( json && 
        json.VAST && 
        json.VAST.Ad && 
        json.VAST.Ad.Wrapper && 
        json.VAST.Ad.Wrapper.VASTAdTagURI && 
        json.VAST.Ad.Wrapper.VASTAdTagURI._value )
        ||
        ( json && 
        json.VAST && 
        json.VAST.Ad[0] && 
        json.VAST.Ad[0].Wrapper && 
        json.VAST.Ad[0].Wrapper.VASTAdTagURI && 
        json.VAST.Ad[0].Wrapper.VASTAdTagURI._value )
      ){

      var url = '';
      if(Array.isArray(json.VAST.Ad)){
        url = json.VAST.Ad[0].Wrapper.VASTAdTagURI._value;
      }else{
        url = json.VAST.Ad.Wrapper.VASTAdTagURI._value
      }

      self.fetch(url, function(doc) {

        if(count <= WRAPPER_LIMIT){
          count++;
          self.parse(doc,callback);
        }else{
          callback('too meny Wrapper');
        }
        
      }, function(e) {callback(e)});
    }else{
      callback(json);
    }
  }, function(e){callback(e)})
}

vast2json.fetch = function(url, ok, ng){

  var xhr  = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        ok(xhr.responseText);
      } else {
        ng(xhr);
      }
    }
  }

  xhr.open("GET", url, true);
  xhr.send(null);
}

vast2json.xmlparse = function(xml, ok, ng){

  xml2js.parseString(xml, xml2js_param, function (err, result){

    if(err){
      ng(err);
    }else{
      ok(result);
    }
  });
}

module.exports = vast2json;
