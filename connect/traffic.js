Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
    
function groupReducer(obj, prop) {
    return obj.reduce(function (acc, item) { //reduce!
      let key = item[prop]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {})
  
}

function getTraffic(appdomain, days, id) { //arg if not domain_admin
        
    console.log("appdomain " + appdomain);
    let data = {};
    if (appdomain) {
        data.appdomain = appdomain;
    }
    if (days && days != 0) {
        let now = Date.now();
        let startpoint = now - (84600 * 1000 * days); 
        console.log("startpoint is " + startpoint + " before " + now );
        data.startpoint = startpoint;
    }

    axios.post('/return_traffic/', data) //this route requires authentication!
    .then(function (response) {
        let trafficCount = response.data.length;
        let tArr = response.data;
        let resp = {};
        ////////////////////////////////////////////////////////////date math for line chart
        console.log("trafficData: " + JSON.stringify(tArr));
        let datetimeStart = new Date(tArr[0].timestamp).toISOString();
        console.log(datetimeStart);
        let dateStartSplit = datetimeStart.substring(0, 10).split("-");
        console.log(dateStartSplit);
        let dateStart = new Date( dateStartSplit[0], dateStartSplit[1] - 1, dateStartSplit[2]);
        console.log(dateStart);

        let dateEnd = new Date(tArr[tArr.length - 1].timestamp);
        let numberOfDays = (dateEnd - dateStart) / (1000 * 3600 * 24);
        
    
        let dayLabels = [];
        let dayCounts = [];
        let showCountNumber = Math.round(numberOfDays);
        if (showCountNumber == 0) {
            showCountNumber = 1;
        }

        // console.log("traffic numberOfDays is "+ numberOfDays + " = " + showCountNumber + " latest " + JSON.stringify(tArr[tArr.length - 1]));
        // dayLabels.push(dateStart.toLocaleDateString());

        for (let i = 0; i < showCountNumber; i++) { //prime the pump
            dayLabels.push(dateStart.addDays(i).toLocaleDateString());
            dayCounts.push(0);
        }

        for (let t = 0; t < tArr.length; t++ ) {
            if (appdomain) {
                if (tArr[t].hasOwnProperty('short_id') && tArr[t].hasOwnProperty('appdomain') && tArr[t].appdomain == appdomain ) {
                    for (let s = 0; s < showCountNumber; s++) {
                        if (tArr[t].timestamp >= dateStart.addDays(s) & tArr[t].timestamp <= dateStart.addDays(s + 1)) {
                            dayCounts[s] = dayCounts[s] + 1; 
                            // console.log("Day " + s + " " + dayCounts[s]);
                        } 
                    }
                    // totalCount++;
                } else {
                    console.log("killing thi9s:" + JSON.stringify(tArr[t]));
                    tArr.splice(t, 1); //drop if they don't have the stuff...
                }
            } else {
                for (let s = 0; s < showCountNumber; s++) {
                    if (tArr[t].timestamp >= dateStart.addDays(s) & tArr[t].timestamp <= dateStart.addDays(s + 1)) {
                        dayCounts[s] = dayCounts[s] + 1; 
                        // console.log("Day " + s + " " + dayCounts[s]);
                    } 
                }
            }
            
        }
        resp.dayLabels = dayLabels;
        resp.dayCounts = dayCounts;
        // console.log("traffic daycounts" + dayCounts);

        ////////////////////////////////////////////////////////// top pages bar chart
        let groupedTraffic = groupReducer(tArr, 'originalUrl');
        // console.log("groupedTraffic " + JSON.stringify(tArr[0]));
        // console.log("traffic count " + trafficCount);
        let urls = Object.keys(groupedTraffic);
        let urlCounts = [];
        for (let i = 0; i < urls.length; i++) {
            // console.log("url : " + urls[i] + " count " + groupedTraffic[urls[i]].length);
            let url = urls[i];
            let item = {};
            item.url = url;
            item.count = groupedTraffic[urls[i]].length;
            urlCounts.push(item);
        }
        urlCounts.sort(({count:a}, {count:b}) => b-a);

                // Bar Chart Example
        // var ctx2 = document.getElementById("topPages");
        let toppagesLabels = [];
        let toppagesCounts = [];
        let showNumber = urlCounts.length < 8 ? urlCounts.length : 10;
        console.log("topPages: " + showNumber);
        for (let i = 0; i < showNumber; i++) {
            toppagesLabels.push(urlCounts[i].url);
            toppagesCounts.push(urlCounts[i].count);
        }
        resp.toppagesCounts = toppagesCounts;
        resp.toppagesLabels = toppagesLabels;
        // console.log("trafficdata " + JSON.stringify(resp));
        
        let markerID = id != null ? id : "traffic_data"; //id may be passed in for "dataviz" markertype, otherwise component set on server from scene tag "traffic"
        let trafficDataEl = document.getElementById(markerID);
        if (trafficDataEl) {
            let trafficViz = trafficDataEl.components.traffic_data_viz
            if (trafficViz) {
                trafficViz.traffic_data(resp);
            } else {
                console.log("no traffic viz component!");
            }
        } 
        // return JSON.stringify(resp);    
    });
}