import Vue from 'vue'
import {
Cascader,
  Tag,
  InputNumber,
  ColorPicker,
  ButtonGroup,
  Switch,
  infiniteScroll,
  Popconfirm,
  Steps,
  Step,
  Slider,
  Upload,
  Tabs,
  TabPane,
  Tooltip,
  Link,
  Pagination,
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Checkbox,
  Radio,
  RadioGroup,
  DatePicker,
  Option,
  Select,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Drawer,
  Image,
  Divider,
  Button,
  Backtop,
  Loading,
  MessageBox,
  Message,
  Notification,
  Popover,
  Carousel,
  CarouselItem,
  Card,
} from 'element-ui'

const components = [
  Cascader,
  Tag,
  InputNumber,
  ColorPicker,
  ButtonGroup,
  Switch,
  Popconfirm,
  Popover,
  Steps,
  Step,
  Slider,
  Upload,
  Tabs,
  TabPane,
  Tooltip,
  Link,
  Pagination,
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Checkbox,
  Radio,
  RadioGroup,
  DatePicker,
  Option,
  Select,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Drawer,
  Image,
  Divider,
  Button,
  Backtop,
  Carousel,
  CarouselItem,
  Card
];
Vue.use(Loading.directive);
Vue.use(infiniteScroll);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$ELEMENT = { zIndex: 10000 };

import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition)

const Element = {
  install (Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

//设置默认语言 英文
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
Vue.use(Element, { locale })
