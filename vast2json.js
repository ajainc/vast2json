if(!window || !window.XMLHttpRequest){
  var window = {};
  window.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
}
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
var imp = [];

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

    try {
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
        var parent = '';
        if(Array.isArray(json.VAST.Ad)){
          parent = json.VAST.Ad[0];
        }else{
          parent = json.VAST.Ad;
        }
        url = parent.Wrapper.VASTAdTagURI._value;
        if(Array.isArray(parent.Wrapper.Impression)){
          parent.Wrapper.Impression.forEach(function(element, index, array) {
              imp.push(element);
          });
        }else{
          imp.push(parent.Wrapper.Impression);
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
        imp = imp.map(function(element, index, array) {
            return element._value;
        });
        json.WrapperImpression = imp;
        callback(json);
      }

    } catch (e) {
      callback(e)
    }
  }, function(e){callback(e)})
}

vast2json.fetch = function(url, ok, ng){

  var xhr  = new window.XMLHttpRequest();

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

vast2json.send = function(url){

  (new Image()).src = url;
}

module.exports = vast2json;
