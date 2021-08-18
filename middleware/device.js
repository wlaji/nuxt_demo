import {deviceType} from '~/utils/deviceType'

export default function (context) {
  context.userAgent = process.server ? context.req.headers["user-agent"] : navigator.userAgent;
  const isMobile = deviceType(context.userAgent).versions.mobile
  if (isMobile) {
    context.deviceType = {type: 'mobile'};
    context.store.commit("SetDeviceType", {type: 'mobile'});
  } else {
    context.deviceType = {type: 'pc'};
    context.store.commit("SetDeviceType", {type: 'pc'});
  }
}
