//模切
export function dieCut(w, canvasScale, scale, bgColor, sizeInfo) {
  let wrapCanvas = new fabric.Rect({
    width: w + 1,
    height: w + 1,
    fill: bgColor
  })
  let wrap, xian, clipPath, wrap_w, wrap_h, xian_w, xian_h

  if (scale >= 1) {
    wrap_w = w * canvasScale
    wrap_h = (w * canvasScale) / scale
    xian_w = w * canvasScale - 20
    xian_h = (w * canvasScale) / scale - 20
  } else {
    wrap_w = w * canvasScale * scale
    wrap_h = w * canvasScale
    xian_w = w * canvasScale * scale - 20
    xian_h = w * canvasScale - 20
  }

  wrap = new fabric.Rect({
    width: wrap_w,
    height: wrap_h,
    fill: '#fff',
    // shadow: 'rgba(0,0,0,0.3) 0px 0px 10px'
  })

  clipPath = new fabric.Rect({
    width: xian_w,
    height: xian_h,
    inverted: true
  })

  let sizeW, sizeH, groupArr
  if (!sizeInfo.notShowSize) {
    sizeW = new fabric.Text(`${sizeInfo.sizeW}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      top: wrap_h / 2 + 10
    })
    sizeH = new fabric.Text(`${sizeInfo.sizeH}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      left: wrap_w / 2 + 10,
      angle: 90
    })
    groupArr = [wrapCanvas, wrap, sizeW, sizeH]
  } else {
    groupArr = [wrapCanvas, wrap]
  }

  let group = new fabric.Group(groupArr, {
    left: w / 2,
    top: w / 2,
    clipPath: clipPath,
    perPixelTargetFind: true,
    selectable: false,
    evented: false,
    isShade: true,
    excludeFromExport: true //不导出到序列化
  })
  return {
    group
  }
}

export function ellipseTeXiao(w, canvasScale, scale, bgColor, sizeInfo) {
  let wrapCanvas = new fabric.Rect({
    width: w + 1,
    height: w + 1,
    fill: bgColor
  })

  let wrap, xian, clipPath, wrap_rx, wrap_ry, xian_rx, xian_ry

  if (scale >= 1) {
    wrap_rx = (w * canvasScale) / 2
    wrap_ry = (w * canvasScale) / 2 / scale
    xian_rx = (w * canvasScale - 20) / 2
    xian_ry = (w * canvasScale - 20) / 2 / scale
  } else {
    wrap_rx = ((w * canvasScale) / 2) * scale
    wrap_ry = (w * canvasScale) / 2
    xian_rx = ((w * canvasScale - 20) / 2) * scale
    xian_ry = (w * canvasScale - 20) / 2
  }

  wrap = new fabric.Ellipse({
    rx: wrap_rx,
    ry: wrap_ry,
    fill: '#fff',
    shadow: 'rgba(0,0,0,0.3) 0px 0px 10px'
  })

  xian = new fabric.Ellipse({
    rx: xian_rx,
    ry: xian_ry,
    fill: 'transparent',
    stroke: '#ccc',
    strokeDashArray: [10],
    strokeWidth: 2,
    strokeUniform: true
  })

  clipPath = new fabric.Ellipse({
    rx: xian_rx,
    ry: xian_ry,
    inverted: true
  })

  let sizeW, sizeH, groupArr
  if (!sizeInfo.notShowSize) {
    sizeW = new fabric.Text(`${sizeInfo.sizeW}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      top: wrap_ry + 10
    })
    sizeH = new fabric.Text(`${sizeInfo.sizeH}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      left: wrap_rx + 10,
      angle: 90
    })
    groupArr = [wrapCanvas, wrap, xian, sizeW, sizeH]
  } else {
    groupArr = [wrapCanvas, wrap, xian]
  }

  let group = new fabric.Group(groupArr, {
    left: w / 2,
    top: w / 2,
    clipPath: clipPath,
    perPixelTargetFind: true,
    selectable: false,
    evented: false,
    isShade: true,
    excludeFromExport: true //不导出到序列化
  })

  return {
    group
  }
}

//矩形
export function rectTeXiao(w, canvasScale, scale, bgColor, sizeInfo) {
  let wrapCanvas = new fabric.Rect({
    width: w + 1,
    height: w + 1,
    fill: bgColor
  })

  let wrap, xian, clipPath, wrap_w, wrap_h, xian_w, xian_h

  if (scale >= 1) {
    wrap_w = w * canvasScale
    wrap_h = (w * canvasScale) / scale
    xian_w = w * canvasScale - 20
    xian_h = (w * canvasScale) / scale - 20
  } else {
    wrap_w = w * canvasScale * scale
    wrap_h = w * canvasScale
    xian_w = w * canvasScale * scale - 20
    xian_h = w * canvasScale - 20
  }

  wrap = new fabric.Rect({
    width: wrap_w,
    height: wrap_h,
    fill: '#fff',
    shadow: 'rgba(0,0,0,0.3) 0px 0px 10px'
  })

  xian = new fabric.Rect({
    width: xian_w,
    height: xian_h,
    fill: 'transparent',
    stroke: '#ccc',
    strokeDashArray: [10],
    strokeWidth: 2,
    strokeUniform: true
  })

  clipPath = new fabric.Rect({
    width: xian_w,
    height: xian_h,
    inverted: true
  })

  let sizeW, sizeH, groupArr
  if (!sizeInfo.notShowSize) {
    sizeW = new fabric.Text(`${sizeInfo.sizeW}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      top: wrap_h / 2 + 10
    })
    sizeH = new fabric.Text(`${sizeInfo.sizeH}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      left: wrap_w / 2 + 10,
      angle: 90
    })
    groupArr = [wrapCanvas, wrap, xian, sizeW, sizeH]
  } else {
    groupArr = [wrapCanvas, wrap, xian]
  }
  let group = new fabric.Group(groupArr, {
    left: w / 2,
    top: w / 2,
    clipPath: clipPath,
    perPixelTargetFind: true,
    selectable: false,
    evented: false,
    isShade: true,
    excludeFromExport: true //不导出到序列化
  })

  return {
    group
  }
}

//圆角矩形
export function roundedRectTeXiao(w, canvasScale, scale, bgColor, sizeInfo) {
  let wrapCanvas = new fabric.Rect({
    width: w + 1,
    height: w + 1,
    fill: bgColor
  })
  let wrap,
    xian,
    clipPath,
    wrap_w,
    wrap_h,
    xian_w,
    xian_h,
    r = (w * canvasScale) / 10
  if (scale >= 1) {
    wrap_w = w * canvasScale
    wrap_h = (w * canvasScale) / scale
    xian_w = w * canvasScale - 20
    xian_h = (w * canvasScale) / scale - 20
  } else {
    wrap_w = w * canvasScale * scale
    wrap_h = w * canvasScale
    xian_w = w * canvasScale * scale - 20
    xian_h = w * canvasScale - 20
  }

  wrap = new fabric.Rect({
    width: wrap_w,
    height: wrap_h,
    fill: '#fff',
    rx: r, //圆角半径
    ry: r, //圆角半径
    shadow: 'rgba(0,0,0,0.3) 0px 0px 10px'
  })

  xian = new fabric.Rect({
    width: xian_w,
    height: xian_h,
    fill: 'transparent',
    stroke: '#ccc',
    strokeDashArray: [10],
    strokeWidth: 2,
    strokeUniform: true,
    rx: r, //圆角半径
    ry: r //圆角半径
  })

  clipPath = new fabric.Rect({
    width: xian_w,
    height: xian_h,
    inverted: true,
    rx: r, //圆角半径
    ry: r //圆角半径
  })

  let sizeW, sizeH, groupArr
  if (!sizeInfo.notShowSize) {
    sizeW = new fabric.Text(`${sizeInfo.sizeW}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      top: wrap_h / 2 + 10
    })
    sizeH = new fabric.Text(`${sizeInfo.sizeH}"`, {
      fontSize: 16, // 字体大小
      fill: '#000000', // 字体颜色
      left: wrap_w / 2 + 10,
      angle: 90
    })
    groupArr = [wrapCanvas, wrap, xian, sizeW, sizeH]
  } else {
    groupArr = [wrapCanvas, wrap, xian]
  }
  let group = new fabric.Group(groupArr, {
    left: w / 2,
    top: w / 2,
    clipPath: clipPath,
    perPixelTargetFind: true,
    selectable: false,
    evented: false,
    isShade: true,
    excludeFromExport: true //不导出到序列化
  })
  return {
    group
  }
}
