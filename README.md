# vast2json
VASTのXMLをJSONに変換

xml文字列でもurlでもおけ

### 使い方

example.js見てね

### Attention

フロント＆webpack使う場合はwebpack.configに以下を追加よろ

```
module.exports = {
  node: {
    child_process: 'empty',
    fs: 'empty'
  }
};
```


#### 入力と出力

これが

```
<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="oxml.xsd">
  <Ad id="1" sequence="0">
    <InLine>
      <AdSystem version="2.0 alpha"></AdSystem>
      <AdTitle>Unknown</AdTitle>
      <Description>Unknown</Description>
      <Survey></Survey>
      <Error></Error>
      <Impression id=""><![CDATA[http://myserver.com/Impression/Ad1trackingResouce]]></Impression>
      <Creatives>
        <Creative id="video" sequence="0" AdID="">
          <Linear>
            <Duration>00:00:32</Duration>
            <MediaFiles>
              <!-- ... -->
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
  <Ad id="2" sequence="1">
    <InLine>
      <AdSystem version="2.0 alpha"></AdSystem>
      <AdTitle>Unknown</AdTitle>
      <Description>Unknown</Description>
      <Survey></Survey>
      <Error></Error>
      <Impression id=""><![CDATA[http://myserver.com/Impression/Ad2trackingResouce]]></Impression>
      <Creatives>
        <Creative id="video" sequence="0" AdID="">
          <Linear>
            <Duration>00:00:30</Duration>
            <MediaFiles>
              <!-- ... -->
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>
```

こんな感じに

```
{
    "VAST": {
        "Ad": [
            {
                "InLine": {
                    "AdSystem": {
                        "_attr": {
                            "version": "2.0 alpha"
                        }, 
                        "_value": ""
                    }, 
                    "AdTitle": {
                        "_value": "Unknown"
                    }, 
                    "Creatives": {
                        "Creative": {
                            "Linear": {
                                "Duration": {
                                    "_value": "00:00:32"
                                }, 
                                "MediaFiles": "  "
                            }, 
                            "_attr": {
                                "AdID": "", 
                                "id": "video", 
                                "sequence": "0"
                            }
                        }
                    }, 
                    "Description": {
                        "_value": "Unknown"
                    }, 
                    "Error": "", 
                    "Impression": {
                        "_attr": {
                            "id": ""
                        }, 
                        "_value": "http://myserver.com/Impression/Ad1trackingResouce"
                    }, 
                    "Survey": ""
                }, 
                "_attr": {
                    "id": "1", 
                    "sequence": "0"
                }
            }, 
            {
                "InLine": {
                    "AdSystem": {
                        "_attr": {
                            "version": "2.0 alpha"
                        }, 
                        "_value": ""
                    }, 
                    "AdTitle": {
                        "_value": "Unknown"
                    }, 
                    "Creatives": {
                        "Creative": {
                            "Linear": {
                                "Duration": {
                                    "_value": "00:00:30"
                                }, 
                                "MediaFiles": "  "
                            }, 
                            "_attr": {
                                "AdID": "", 
                                "id": "video", 
                                "sequence": "0"
                            }
                        }
                    }, 
                    "Description": {
                        "_value": "Unknown"
                    }, 
                    "Error": "", 
                    "Impression": {
                        "_attr": {
                            "id": ""
                        }, 
                        "_value": "http://myserver.com/Impression/Ad2trackingResouce"
                    }, 
                    "Survey": ""
                }, 
                "_attr": {
                    "id": "2", 
                    "sequence": "1"
                }
            }
        ], 
        "_attr": {
            "version": "2.0", 
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance", 
            "xsi:noNamespaceSchemaLocation": "oxml.xsd"
        }
    }
}
```