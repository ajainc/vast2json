import vast2json from './vast2json';

const xml = 'http://localhost:4000/vast_inline_linear_wrapper.xml';
const Vast2json = new vast2json(xml);
Vast2json.toJson(function(json){console.log(json)});