var vast2json = require('./vast2json');
//var xml = 'http://localhost:4000/vast_inline_linear_wrapper.xml';
console.log("--- inline ---")
var xml = `
<VAST version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="oxml.xsd">
    <Ad id="1" sequence="0">
    <InLine>
        <AdSystem version="2.0 alpha">Test</AdSystem>
        <AdTitle>Unknown</AdTitle> <Description>Unknown</Description>
        <Survey></Survey> <Error></Error>
        <Impression id="Test"><![CDATA[http://myserver.com/Impression/Ad1trackingResouce]]></Impression>
        <Creatives>
            <Creative id="video" sequence="0" AdID="">
                <Linear>
                    <Duration>00:00:32</Duration>
                    <MediaFiles> <!-- ... --> </MediaFiles>
                </Linear>
            </Creative>
        </Creatives>
    </InLine>
    </Ad>
    <Ad id="2" sequence="1">
    <InLine>
        <AdSystem version="2.0 alpha">Test</AdSystem>
        <AdTitle>Unknown</AdTitle> <Description>Unknown</Description>
        <Survey></Survey> <Error></Error>
        <Impression id="Test"><![CDATA[http://myserver.com/Impression/Ad2trackingResouce]]></Impression>
        <Creatives>
            <Creative id="video" sequence="0" AdID="">
                <Linear>
                    <Duration>00:00:30</Duration>
                    <MediaFiles> <!-- ... --> </MediaFiles>
                </Linear>
            </Creative>
        </Creatives>
    </InLine>
</Ad></VAST>`;
vast2json.toJson(xml,function(json){console.log(JSON.stringify(json))});

console.log("--- wrapper ---")
var xml = `
<VAST version="2.0">
    <Ad id="602833">
    <Wrapper>
        <AdSystem>Acudeo Compatible</AdSystem>
        <VASTAdTagURI>
            http://demo.tremormedia.com/proddev/vast/vast_inline_linear.xml
        </VASTAdTagURI>
        <Error>http://myErrorURL/wrapper/error</Error>
        <Impression>http://myTrackingURL/wrapper/impression</Impression>
        <Creatives>
        <Creative AdID="602833">
        <Linear>
        <TrackingEvents>
        <Tracking event="creativeView">http://myTrackingURL/wrapper/creativeView</Tracking>
        <Tracking event="start">http://myTrackingURL/wrapper/start</Tracking>
        <Tracking event="midpoint">http://myTrackingURL/wrapper/midpoint</Tracking>
        <Tracking event="firstQuartile">http://myTrackingURL/wrapper/firstQuartile</Tracking>
        <Tracking event="thirdQuartile">http://myTrackingURL/wrapper/thirdQuartile</Tracking>
        <Tracking event="complete">http://myTrackingURL/wrapper/complete</Tracking>
        <Tracking event="mute">http://myTrackingURL/wrapper/mute</Tracking>
        <Tracking event="unmute">http://myTrackingURL/wrapper/unmute</Tracking>
        <Tracking event="pause">http://myTrackingURL/wrapper/pause</Tracking>
        <Tracking event="resume">http://myTrackingURL/wrapper/resume</Tracking>
        <Tracking event="fullscreen">http://myTrackingURL/wrapper/fullscreen</Tracking>
        </TrackingEvents>
        </Linear>
        </Creative>
        <Creative>
        <Linear>
        <VideoClicks>
        <ClickTracking>http://myTrackingURL/wrapper/click</ClickTracking>
        </VideoClicks>
        </Linear>
        </Creative>
        <Creative AdID="602833-NonLinearTracking">
        <NonLinearAds>
        <TrackingEvents> </TrackingEvents>
        </NonLinearAds>
        </Creative>
        </Creatives>
    </Wrapper>
    </Ad>
</VAST>
`;
vast2json.toJson(xml,function(json){console.log(JSON.stringify(json))});
