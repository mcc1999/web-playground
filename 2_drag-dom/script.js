const imgs = ['21.png', '31.png', '41.png', '51.png', '61.png', '71.png', '81.png', '91.png', '101.png', 'j1.png', , 'q1.png', 'k1.png', 'a1.png', 'w1.png', 'w2.png',];
const imgContainer = document.getElementById('img_container');
let draggingNode = null;

renderCards();
function renderCards() {
  imgContainer.innerHTML = null;
  imgs.forEach(img => {
    const node = document.createElement('img');
    node.src = `./image/${img}`;
    imgContainer.appendChild(node);
  });
}

imgContainer.ondragstart = (event) => {
  event.dataTransfer.setData("image/*", event.target);
  event.dataTransfer.effectAllow = 'move';
  draggingNode = event.target;
}

imgContainer.ondragover = (event) => {
  event.dataTransfer.dropEffect = 'move';
  //取消默认行为
  event.preventDefault();
  const target = event.target;
  //因为dragover会发生在imagContainer上，所以要判断是不是img
  if (target.nodeName === "IMG") {
    if (target !== draggingNode) {
      //getBoundingClientRect()用于获取某个元素相对于视窗的位置集合
      const targetRect = target.getBoundingClientRect();
      const draggingNodeRect = draggingNode.getBoundingClientRect();
      if (target && target.animated) {
        return;
      }
      if (getIndex(draggingNode) < getIndex(target)) {
        //nextSibling 属性可返回某个元素之后紧跟的节点（处于同一树层级中）。
        target.parentNode.insertBefore(draggingNode, target.nextSibling);
      } else {
        target.parentNode.insertBefore(draggingNode, target);
      }
      addAnimate(draggingNodeRect, draggingNode);
      addAnimate(targetRect, target);
    }
  }
}

//获取元素在父元素中的index
function getIndex(el) {
  let index = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  // previousElementSibling属性返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）。
  while (el && (el = el.previousElementSibling)) {
    index++;
  }
  return index;
}

function addAnimate(prevRect, target) {
  const ms = 300;

  if (ms) {
    const currentRect = target.getBoundingClientRect();
    //nodeType 属性返回以数字值返回指定节点的节点类型。1=元素节点  2=属性节点
    if (prevRect.nodeType === 1) {
      prevRect = prevRect.getBoundingClientRect();
    }
    addStyle(target, 'transition', 'none');
    addStyle(target, 'transform', 'translate3d(' +
      (prevRect.left - currentRect.left) + 'px,' +
      (prevRect.top - currentRect.top) + 'px,0)'
    );

    target.offsetWidth; // 触发重绘
    //放在timeout里面也可以
    // setTimeout(function() {
    //     addStyle(target, 'transition', 'all ' + ms + 'ms');
    //     addStyle(target, 'transform', 'translate3d(0,0,0)');
    // }, 0);
    addStyle(target, 'transition', 'all ' + ms + 'ms');
    addStyle(target, 'transform', 'translate3d(0,0,0)');

    clearTimeout(target.animated);
    target.animated = setTimeout(function () {
      addStyle(target, 'transition', '');
      addStyle(target, 'transform', '');
      target.animated = false;
    }, ms);
  }
}
//给元素添加style
function addStyle(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      //使用DefaultView属性可以指定打开窗体时所用的视图
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style)) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function shuffleCards() {
  imgs.sort(i => { return Math.random() > 0.5 ? 1 : -1 });
  renderCards();
}