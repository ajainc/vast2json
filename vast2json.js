const xml2js = require('xml2js');
const xml2js_param = {
  explicitArray: false,
  explicitCharkey: true,
  explicitAttrkey: true,
  charkey: '_value',
  attrkey: '_attr',
  trim: true,
}

const WRAPPER_LIMIT = 5;
let count = 1;
let url = '';

export default class vast2json {

  constructor(req){
    count = 1;
    url = req;
  }

  toJson(func){
    if(url.indexOf('http') === 0){
      this.fetch(url).then((doc) => {
        this.parse(doc,func);
      });
    }else{
      this.parse(url,func);
    } 
  }
  
  parse(str,func){

    this.xmlparse(str).then((json)=>{
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

        let url = '';
        if(Array.isArray(json.VAST.Ad)){
          url = json.VAST.Ad[0].Wrapper.VASTAdTagURI._value;
        }else{
          url = json.VAST.Ad.Wrapper.VASTAdTagURI._value
        }

        this.fetch(url).then((doc) => {

          if(count <= WRAPPER_LIMIT){
            count++;
            this.parse(doc,func);
          }else{
            func('too meny Wrapper');
          }
          
        }, (e) => {func(e)});
      }else{
        func(json);
      }
    }, (e) => {func(e)})
  }

  fetch(url){

    return new Promise((resolve, reject) => {

      let xhr  = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr);
          }
        }
      }

      xhr.open("GET", url, true);
      xhr.send(null);
    });

  }

  xmlparse(xml){

    return new Promise((resolve, reject) => {

      xml2js.parseString(xml, xml2js_param, (err, result) => {

        if(err){
          reject(err);
        }else{
          resolve(result);
        }
      });

    });
  }
  
}