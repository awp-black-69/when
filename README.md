##WHEN##
A basic library to create any request to a promise callback.

###Usage###

####Simple promise####
```JS
var somePromsise = when((cb)=>{
  //do something, sync / async
  setTimeout(cb, 500);
);

somePromise.then((err, resp)=>{
  // do something further
  // or return another THENable promise
});
```

####Promise .all####
```JS
var allPromise = when.all([when.delay(200), when.delay(400), when.delay(222)]); // List of THENable promise

allPromise.then((errs, resps)=>{
  // errs: array of all the errors in corresponding promises
  // resps: response of all the responses in corresponding promises
});
```

####Promise alternative of setTimeout####
```JS
when
  .delay(300)
  .then(()=>{
    // setTimeout of 300ms
  });
```
