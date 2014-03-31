'use strict'

angular.module('lmisChromeApp').service('notificationService', function ($window, $log) {
 this.BEEP_MEDIA_URL = '/media/beep.wav';
 $window.navigator.vibrate = $window.navigator.vibrate || $window.navigator.webkitVibrate
     || $window.navigator.mozVibrate || $window.navigator.msVibrate;

 this.vibrate = function(milliseconds){
  if($window.navigator.vibrate){
    $window.navigator.vibrate(milliseconds);
  }
 };

 this.beep = function(){
   var beepMedia = Media('/media/beep.wav', function(){
     console.log('played');
   }, function(error){
     console.log('error '+error);
   });
   beepMedia.play();
   if ($window.Audio) {
     var audio = new $window.Audio(this.BEEP_MEDIA_URL);
     audio.play();
   }
  };

});