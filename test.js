const src=require('fs').readFileSync(__dirname+'/index.html','utf8');
const m=src.match(/function quote[\s\S]*?\n\}/)||src.match(/function quote\(.*?\}\n/);
const quote=new Function(src.match(/function quote\([\s\S]*?total:sub\+tax\}\}/)[0]+';return quote')();
const a=require('assert');
let q=quote(10,20,0,0,0);a.strictEqual(q.total,200);
q=quote(10,20,25,10,14);a.ok(Math.abs(q.total-(200*1.25*0.9*1.14))<1e-9);
console.log('tests passed');
// edge cases: tax/discount order (discount first, then tax), zero, big discount
a.ok(Math.abs(quote(10,100,0,100,20).total) < 1e-9);          // 100% discount -> 0
a.ok(Math.abs(quote(0,50,25,10,10).total) < 1e-9);            // zero hours -> 0
a.ok(Math.abs(quote(3,33.33,0,0,15).total - 3*33.33*1.15) < 1e-9);
console.log('edge tests passed');
// clamping inside quote(): negative, over-100% discount and NaN count as documented
a.strictEqual(quote(-5,20,0,0,0).total,0);
a.strictEqual(quote(10,20,0,150,0).total,0);
a.strictEqual(quote(NaN,20,0,0,0).total,0);
console.log('clamping tests passed');
