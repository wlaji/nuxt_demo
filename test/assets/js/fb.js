export const initControlIcon = function (fabricStage) {
  let dataImage = [
    require("../../assets/images/controlIcon/zoom.png") /*scale*/,
    require("../../assets/images/controlIcon/delete.png") /*delete*/,
    require("../../assets/images/controlIcon/rotate.png") /*rotate*/,
    require("../../assets/images/controlIcon/move.png") /*move*/,
  ];
  let scaleImg = document.createElement('img');
  scaleImg.src = dataImage[0];
  var deleteImg = document.createElement('img');
  deleteImg.src = dataImage[1];
  let rotateImg = document.createElement('img');
  rotateImg.src = dataImage[2];
  let moveImg = document.createElement('img');
  moveImg.src = dataImage[3];

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24
  });

  fabric.Object.prototype.controls.rotateControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyle: 'crosshair',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderIcon(rotateImg),
    cornerSize: 24,
    withConnection: true
  });

  fabric.Object.prototype.controls.scaleControl = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyle: 'se-resize',
    actionHandler: fabric.controlsUtils.scalingEqually,
    actionName: 'scale',
    render: renderIcon(scaleImg),
    cornerSize: 24,
    withConnection: true
  });

  fabric.Object.prototype.controls.moveControl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyle: 'move',
    actionHandler: fabric.controlsUtils.dragHandler,
    actionName: 'move',
    render: renderIcon(moveImg),
    cornerSize: 24
  });

  function deleteObject(eventData, target) {
    var canvas = target.target.canvas;
    canvas.remove(target.target);
    canvas.requestRenderAll();
  }

  function rotateObject(eventData, target) {
    var canvas = target.target.canvas;
    canvas.rotate(target.target);
    canvas.requestRenderAll();
  }

  function scaleObject(eventData, target) {
    var canvas = target.target.canvas;
    canvas.remove(target.target);
    canvas.requestRenderAll();
  }

  function moveObject(eventData, target) {
    var canvas = target.target.canvas;
    canvas.remove(target.target);
    canvas.requestRenderAll();
  }

  function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
};


export const resizeFabricStage = function (canvas,defaultSize, designBody) {
  let ox = parseFloat(designBody.offsetWidth - 2),
    oy = parseFloat(designBody.offsetHeight - 2);
  let osize = ox > oy ? oy : ox;
  if (osize > defaultSize) {
    canvas.setWidth(defaultSize);
    canvas.setHeight(defaultSize);
    canvas.setZoom(1);
    canvas.requestRenderAll();
  } else {
    let factor = osize / defaultSize;
    canvas.setWidth(osize);
    canvas.setHeight(osize);
    canvas.setZoom(factor);
    canvas.requestRenderAll();
  }
};

export const fb = {
  copyObj: '',//复制的一个元素
  mirror: function (canvas) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    let selectedEle = canvas.getActiveObject();
    if (selectedEle.get('IsMain') == 1) {
      return false;
    }
    selectedEle.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        flipX: !clonedObj.get("flipX"),
      });
      clonedObj.rotate(-clonedObj.get("angle"));
      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();

    });
  },
  copy: function (canvas) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    let _clipboard;
    let selectedEle = canvas.getActiveObject();
    if (selectedEle.get('IsMain') == 1) {
      return false;
    }
    selectedEle.clone((cloned) => {
      _clipboard = cloned;
      _clipboard.clone(clonedObj => {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
        });
        if (clonedObj.type === "activeSelection") {
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function (obj) {
            canvas.add(obj);
          });
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  },
  move: function (canvas, type) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    let selectedEle = canvas.getActiveObject();
    switch (type) {
      case "left":
        selectedEle.set("left", selectedEle.get("left") - 1).setCoords();
        break;
      case "right":
        selectedEle.set("left", selectedEle.get("left") + 1).setCoords();
        break;
      case "up":
        selectedEle.set("top", selectedEle.get("top") - 1).setCoords();
        break;
      case "down":
        selectedEle.set("top", selectedEle.get("top") + 1).setCoords();
        break;
    }
    canvas.requestRenderAll();
  },
  deleteActiveEle: function (canvas) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    let selectedEle = canvas.getActiveObject();
    canvas.discardActiveObject();
    if (selectedEle.type === "activeSelection") {
      selectedEle.canvas = canvas;
      selectedEle.forEachObject(function (obj) {
        canvas.remove(obj);
      });
      selectedEle.setCoords();
    } else {
      canvas.remove(selectedEle);
    }
    canvas.requestRenderAll();
  },
  cutEle: function (canvas) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    canvas.getActiveObject().clone((cloned) => {
      this.copyObj = cloned;
      this.deleteActiveEle(canvas);
    });
  },
  copyEle: function (canvas) {
    if (!canvas.getActiveObject()) {
      return false;
    }
    canvas.getActiveObject().clone((cloned) => {
      this.copyObj = cloned;
    });
  },
  pasteEle: function (canvas) {
    if (!this.copyObj) {
      return false;
    }
    let _clipboard = this.copyObj;
    _clipboard.clone(clonedObj => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
      });
      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      _clipboard.top += 10;
      _clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    })
  },
  flipX: function (canvas) {
    let selectedEle = canvas.getActiveObject();
    if (!selectedEle) {
      return false;
    }
    if (selectedEle) {
      selectedEle.get("flipX")
        ? selectedEle.set("flipX", false)
        : selectedEle.set("flipX", true);
      canvas.requestRenderAll();
    }
  },
  flipY: function (canvas) {
    let selectedEle = canvas.getActiveObject();
    if (!selectedEle) {
      return false;
    }
    if (selectedEle) {
      selectedEle.get("flipY")
        ? selectedEle.set("flipY", false)
        : selectedEle.set("flipY", true);
      canvas.requestRenderAll();
    }
  },
  selectAll: function (canvas) {
    if (canvas.getObjects().length === 0) return false;
    let sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  },
  centerEle: function (canvas) {
    let selectedEle = canvas.getActiveObject();
    if (!selectedEle) {
      return false;
    }
    canvas.viewportCenterObject(selectedEle);
  },
  undoStatus: '',
  redoStatus: '',
}