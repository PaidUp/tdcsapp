var exceptionHandler = function(){



  var ExceptionHandler = this;

  function put(type,  message){
    $.post( "/api/v1/logger/put", {type:type, message:message});
  };

  ExceptionHandler.debug = function(message){
    return put('debug' , message);
  };

  ExceptionHandler.info = function(message){
    return put('info' , message);
  };

  ExceptionHandler.warn = function(message){
    return put('warn' , message);
  };

  ExceptionHandler.error = function(message){
    return put('error' , message);
  };

  return ExceptionHandler;
  };
