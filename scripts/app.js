// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
    'use strict';
    var app={days:['sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat']
    }

    const applicationServerPublicKey = 'BPBXViQ6dojBJbYFfq2SyYBM3FpWypXSo5ELuVz1r8SYBRXsW_gRtLyaus1ref1feHOd1sIIch1gtDDJYI9btB8';
    var mealData = {
      "data": [
        {
          "meal": "BUY 1 CHICKEN/VEGGIE STEAMED MOMOS"
        },
        {
            "meal":"BUY 9' ORIGINAL & GET 6' PETITA FREE"
        }
      ]
    }
    var masterData=[];
    var tab3 = document.getElementById('tab3');
    var tab4 = document.getElementById('tab4');
    var tab1 = document.getElementById('tab1');
    var tab2 = document.getElementById('tab2');

    var mainDiv = document.getElementById('mainDiv');
    var secondDiv = document.getElementById('secondDiv');
    var thirdDiv = document.getElementById('thirdDiv');

    var displayDate;
    var displayTime;
     var time;
     var flag;
     var status = navigator.onLine;
     $("#success-alert").hide();
     var func = setInterval(function(){
        status = navigator.onLine;
         if(!status){
            flag = true;
             document.getElementById('alertDiv').style.display = "block";
         }else if(flag && status){
            flag = false;
            document.getElementById('alertDiv').style.display = "none";
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
               $("#success-alert").slideUp(500);
                }); 
         }
     },3000)
     
    app.displayAlert = function(){
     
      var online = window.navigator.onLine;
      $("#success-alert").hide();
      if(online && time){
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
               $("#success-alert").slideUp(500);
                }); 
            clearInterval(time);

      }
      if(online){
        document.getElementById('alertDiv').style.display = "none";
      }else{
        time = setInterval(function(){
           app.displayAlert();

          }, 3000);
        document.getElementById('alertDiv').style.display = "block";
      }
    }

   // app.displayAlert();

            
            
                 
            


    app.getData = function(){
        var url = 'https://college-movies.herokuapp.com/';
        if ('caches' in window) {
            /*
            * Check if the service worker has already cached this city's weather
            * data. If the service worker has the data, then display the cached
             * data while the app fetches the latest data.
            */
            caches.match(url).then(function(response) {
              if (response) {
                response.json().then(function updateFromCache(json) {
                   masterData = json;
                   app.updateView();
                   app.updateData(masterData);
                });
              }
            });
        }
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText) ;
            masterData = data
            app.updateView();
            app.updateData(masterData);
          }
        };
        request.open('GET', url);
        request.send();
    }

    app.updateView = function(){
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() + 2);
        document.getElementById('link3').innerHTML = tempDate.toUTCString();
        tempDate.setDate(tempDate.getDate() + 1);
        document.getElementById('link4').innerHTML = tempDate.toUTCString();
    }   

    app.updateData = function(masterData, tab ){
        tab1.classList.remove('active');
        tab2.classList.remove('active');
        tab3.classList.remove('active');
        tab4.classList.remove('active');
        var element = document.getElementById('movieList');
        var moviesData;
        if(element){
            element.parentNode.removeChild(element);
        }
        if(tab){
            tab.setAttribute('class', 'active')
        }else{
            tab1.setAttribute('class', 'active')
        }
        if(tab){
           if(tab.id == "tab1"){
                moviesData =  masterData.filter(function(item, index){
                    return index < 5;
                }) 
                displayDate = new Date();

           }else if(tab.id == "tab2"){
                moviesData =  masterData.filter(function(item, index){
                    return (index >= 10 && index < 15);
                }) 
                displayDate = new Date();
                displayDate.setDate(displayDate.getDate() + 1);
           }else if(tab.id == "tab3"){
                moviesData =  masterData.filter(function(item, index){
                    return (index >= 20 && index < 25);
                })
                displayDate = new Date();
                displayDate.setDate(displayDate.getDate() + 2);
           }else{
                 moviesData =  masterData.filter(function(item, index){
                    return (index >= 30 && index < 35);
                })
                displayDate = new Date();
                displayDate.setDate(displayDate.getDate() + 3);
           }
        }else{
            var moviesData =  masterData.filter(function(item, index){
                return index < 5;
            })  
            displayDate = new Date();
        }
        
        var date = new Date();
        var day = date.getDay();
        var currentDay = app.days[day];
        var currentData =[];
        var data = moviesData;
        _.filter(data , function(payload, index){
            var ul = document.createElement('ul');
            ul.className = "list-group";
            ul.setAttribute('id', 'movieList');
            document.getElementById('listDiv').appendChild(ul);
            var  el = document.createElement('li');
            el.className = "list-group-item";
            el.id = index;
            el.innerHTML = payload.title;
            document.getElementById('movieList').appendChild(el);
            var dayData = payload.runningTimes[currentDay];
            _.filter(dayData, function(time){
                var spn = document.createElement('span');
                spn.innerHTML = "&nbsp;&nbsp;"
                //spn.innerHTML= '&nbsp;&nbsp<button  onClick="add()"  class="btn btn-default" value= '+ time +'>'+time
                document.getElementById(index).appendChild(spn)
                var btn = document.createElement('button');
                btn.className= "btn btn-default"
                btn.setAttribute("type", 'button');
                btn.setAttribute("value", payload.title);
                btn.innerHTML = time;
                btn.addEventListener('click', function(e){
                    app.add(e.target, data);
                })
                document.getElementById(index).appendChild(btn);
            })
            
        });
    }

    var selectedMovie;
    app.add = function(target, data){
       $("#mainDiv").hide();
       $("#secondDiv").show();
       selectedMovie = _.findWhere(data, {title:target.value});
       displayTime = target.innerHTML;


    }

    tab3.addEventListener('click', function(event){
        app.updateData(masterData, tab3);
    })

    tab1.addEventListener('click', function(event){
        app.updateData(masterData, tab1)
    })

    tab2.addEventListener('click', function(){
        app.updateData(masterData, tab2);
    })

    tab4.addEventListener('click', function(){
        app.updateData(masterData, tab4)
    })

    document.getElementById('cancel').addEventListener('click', function(){
        app.cancel();
    })

    document.getElementById('proceed').addEventListener('click', function(){
       app.Proceed();
    })

    document.getElementById('confirmTicket').addEventListener('click', function(){
       app.confirmTicket();
    })

    document.getElementById('cancelBooking').addEventListener('click', function(){
       app.cancelBooking();
    })
    


    app.cancel = function(){
      $("#mainDiv").show();
      $("#secondDiv").hide();
    }

    app.Proceed = function(){
      $("#secondDiv").hide();
      $("#thirdDiv").show();
      var src = "images/movies/"+ selectedMovie.title; 
      $("#movieImage").attr("src", src);
      $("#movieImage").attr("alt", selectedMovie.title);
      $('#movieHeading').text(selectedMovie.title);
      displayDate = displayDate.toString();
      var arr = displayDate.split(" ");
      arr = arr.slice(0,4);
      var date="";
      _.filter(arr, function(data, index){
         date +=" ";
        if(index === 0){
          date +=data +',';
        }else{
          date += data;
        }
      })
      date = date +" "+ displayTime;
      console.log("date", date)
      $('#movieTime').text(date);

    }

    app.confirmTicket = function(){
      window.location.href = "confirm.html";
    }

    app.cancelBooking= function(){
       location.reload();
    }
//usage:

    app.getData();

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  

  
var swRegistration;
  // TODO add service worker code here
   if ('serviceWorker' in navigator) {
         navigator.serviceWorker
         .register('./service-worker.js')
         .then(function(swReg) { 
            swRegistration = swReg;
            app.initializeUI();
             });
    }

    var  isSubscribed;
    var userSubscription;
    app.initializeUI = function() {
    // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
              console.log('User IS subscribed.');
            } else {
                app.subscribeUser();
              console.log('User is NOT subscribed.');
            }
        });
    }  

    app.urlB64ToUint8Array =function (base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    app.subscribeUser =function () {
        const applicationServerKey = app.urlB64ToUint8Array(applicationServerPublicKey);
          swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            userSubscription = subscription;
            updateSubscriptionOnServer(subscription);
            isSubscribed = true;

        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
        });
    }



})();

