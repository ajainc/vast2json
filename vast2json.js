var XMLHR = "";

if(typeof XMLHttpRequest === 'undefined'){
  XMLHR = require("xmlhttprequest").XMLHttpRequest;
}else{
  XMLHR = XMLHttpRequest;
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
var trackingEvents = {'linear': {}};

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

        // Get Impression
        if(Array.isArray(parent.Wrapper.Impression)){
          parent.Wrapper.Impression.forEach(function(element, index, array) {
              imp.push(element);
          });
        }else{
          imp.push(parent.Wrapper.Impression);
        }

        // Get TrackingEvents (only Linear ad)
        for (var i = 0; i < parent.Wrapper.Creatives.Creative.length; i++) {
          try {
            var creative = parent.Wrapper.Creatives.Creative[i];
            if (!creative.Linear.TrackingEvents) continue;
            if(!Array.isArray(creative.Linear.TrackingEvents.Tracking)) {
              creative.Linear.TrackingEvents.Tracking = [creative.Linear.TrackingEvents.Tracking];
            }
            for (var j = 0; j < creative.Linear.TrackingEvents.Tracking.length; j++) {
              var tracking = creative.Linear.TrackingEvents.Tracking[j];
              if(!trackingEvents['linear'][tracking._attr.event]) {
                trackingEvents['linear'][tracking._attr.event] = [];
              }
              trackingEvents['linear'][tracking._attr.event].push(tracking._value)
            }
          } catch (e) {
            // no tracking events
          }
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
        json.WrapperTrackingEvents = trackingEvents;
        callback(json);
      }

    } catch (e) {
      callback(e)
    }
  }, function(e){callback(e)})
}

vast2json.fetch = function(url, ok, ng){

  var xhr  = new XMLHR();

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
