var app = angular.module('chatApp',[]);

app.controller('chatController', function($scope, socket){
  $scope.messages = [];
  $scope.form = {};
  $scope.users = [];
  $scope.name = '';

  socket.on('init', function(data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('send:message', function(message) {
    $scope.messages.unshift(message);
    if (!document.hasFocus()) {
      if (Notification.permission !== "granted") {
          Notification.requestPermission();
      } else {
          var notification = new Notification(message.user, {
            body: message.text,
          });
      }
    }
  });

  socket.on('change:name', function(data) {
    changeUserName(data.oldName, data.newName);
  });

  socket.on('user:join', function(data) {
    $scope.messages.unshift({user: 'info', text: data.name + ' has joined'})
    $scope.users.push(data.name);
  });

  socket.on('user:left', function(data) {
    $scope.messages.unshift({user: 'info', text: data.name + ' has left'})
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] == data.name) {
        $scope.users.splice(i,1);
      }
    }
  });

  var changeUserName = function(oldName, newName) {
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i] == oldName) {
        $scope.users[i] = newName;
      }
    }
  };

  $scope.sendMessage = function () {
    var msg = $scope.form.text;
    if (msg) {
      socket.emit('send:message', msg);
      $scope.messages.unshift({user: $scope.name, text: msg});
      $scope.form.text = '';
    }
  };

  $scope.changeName = function () {
    var newName = $scope.form.name;
    if (newName) {
      socket.emit('change:name', {name: newName}, function(res){
        if (res) {
          changeUserName($scope.name, newName);
          $scope.name = newName;
          $scope.form.name = '';
        } else {
          $scope.form.name = '';
        }
      });
    }
  };

});

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
