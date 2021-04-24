let aite = window.opener;
if (!aite) {
  aite = window.open(location.href);
}
window.aite = aite;

window.addEventListener('message', (msg) => {
  console.log('add event listener');
  console.log('hoge msg', msg);
  array.forEach((func) => {
    func(msg);
  });
});

const array = [];

window.register = (callback) => {
  console.log('register!!!');
  array.push(callback);
};

window.remove = (callback) => {
  console.log('remove!!!');
  array.splice(array.findIndex(callback), 1);
};
