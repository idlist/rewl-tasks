Promise.all([
  Promise.resolve(1),
  Promise.reject('test'),
]).then(r => console.log(r))