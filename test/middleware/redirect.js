export default function(context) {
  if (process.server) {
    let { redirect } = context
    let url = context.route.fullPath
    switch (url) {
      case '/Custom-stickers/die-cut-stickers':
        redirect(301, 'https://www.customsticker.com/Die-cut-stickers')
        break
      case '/Custom-stickers/vinyl-lettering':
        redirect(301, 'https://www.customsticker.com/Vinyl-lettering')
        break
      case '/Custom-buttons/circle-buttons':
        redirect(301, 'https://www.customsticker.com/Circle-buttons')
        break
      case '/Custom-buttons/custom-oval-buttons':
        redirect(301, 'https://www.customsticker.com/Custom-oval-buttons')
        break
      case '/Custom-labels/die-cut-labels':
        redirect(301, 'https://www.customsticker.com/Die-cut-labels')
        break
      case '/Custom-stickers/kiss-cut-stickers':
        redirect(301, 'https://www.customsticker.com/Kiss-cut-stickers')
        break
      case '/Custom-stickers/clear-stickers':
        redirect(301, 'https://www.customsticker.com/Clear-stickers')
        break
      case '/Custom-labels/square-labels':
        redirect(301, 'https://www.customsticker.com/Square-labels')
        break
      case '/Custom-stickers/bumper-stickers':
        redirect(301, 'https://www.customsticker.com/Bumper-stickers')
        break
      case '/Custom-stickers/transfer-stickers':
        redirect(301, 'https://www.customsticker.com/Transfer-stickers')
        break
      case '/Custom-stickers/sticker-sheets':
        redirect(301, 'https://www.customsticker.com/Sticker-sheets')
        break
      case '/Custom-stickers/static-clings-decals':
        redirect(301, 'https://www.customsticker.com/Static-clings-decals')
        break
      case '/Custom-labels/custom-rectangle-labels':
        redirect(301, 'https://www.customsticker.com/Custom-rectangle-labels')
        break
      case '/Custom-labels/clear-labels':
        redirect(301, 'https://www.customsticker.com/Clear-labels')
        break
      case '/Custom-labels/circle-labels':
        redirect(301, 'https://www.customsticker.com/Circle-labels')
        break
      case '/Custom-buttons/custom-rectangle-buttons':
        redirect(301, 'https://www.customsticker.com/Rectangle-buttons')
        break
      case '/Custom-stickers/rounded-corner-stickers':
        redirect(301, 'https://www.customsticker.com/Rounded-corner-stickers')
        break
      case '/make-your-own-stickers/kiss-cut-stickers':
        redirect(301, 'https://www.customsticker.com')
        break
      case '/make-your-own-stickers/die-cut-stickers':
        redirect(301, 'https://www.customsticker.com')
        break
      case '/make-your-own-stickers/circle-stickers':
        redirect(301, 'https://www.customsticker.com')
        break
      case '/Custom-stickers/rectangle-stickers':
        redirect(301, 'https://www.customsticker.com/Rectangle-stickers')
        break
      case '/Custom-stickers/oval-stickers':
        redirect(301, 'https://www.customsticker.com/Oval-stickers')
        break
      case '/Custom-stickers/circle-stickers':
        redirect(301, 'https://www.customsticker.com/Circle-stickers')
        break
      case '/Custom-stickers/square-stickers':
        redirect(301, 'https://www.customsticker.com/Square-stickers')
        break
      case '/Custom-stickers/front-adhesive-stickers':
        redirect(301, 'https://www.customsticker.com/Front-adhesive-stickers')
        break
      case '/custom-label/oval-labels/':
        redirect(301, 'https://www.customsticker.com/Oval-labels')
        break
      case '/custom-buttons/square-button':
        redirect(301, 'https://www.customsticker.com/Square-buttons')
        break
      case '/template':
        redirect(301, 'https://www.customsticker.com')
        break
      case '/options/custom-stickers-cheap':
        redirect(301, 'https://www.customsticker.com/custom-stickers-cheap')
        break
    }
  }
}








