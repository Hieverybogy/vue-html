/**
 * Created by JANZ on 2017/2/27.
 */

import Loading from './loading';
import Notice from './notice';
import Message from './message';
import MessageBox from './message_box';

import ZsIcon from './icon';
import ZsDialog from './dialog';
import ZsButton from './button';
import ZsButtonGroup from './button_group';
import ZsInput from './input';
import ZsInputNumber from './input_number';
import ZsTag from './tag';
import ZsSwitch from './switch';
import ZsScrollbar from './scrollbar';
import ZsSelectMenu from './select/src/select-dropdown.vue';
import ZsOptionGroup from './select/src/option-group.vue';
import ZsOption from './select/src/option.vue';
import ZsSelect from './select';

import ZsForm from './form';
import ZsFormItem from './form-item';
import ZsRadio from './radio';
import ZsRadioGroup from './radio-group';
import ZsRadioButton from './radio-button';
import ZsCheckbox from './checkbox';
import ZsCheckboxGroup from './checkbox-group';

import ZsPopover from './popover';
import ZsPagination from './pagination';

import ZsTable from './table';

import ZsSteps from './steps';
import ZsStep from './step';
import ZsBreadcrumb from './breadcrumb';
import ZsBreadcrumbItem from './breadcrumb-item';

import datePicker from './date-picker/index.js';

const components = [
    ZsIcon,
    ZsDialog,
    ZsButton,
    ZsButtonGroup,
    ZsInput,
    ZsInputNumber,
    ZsTag,
    ZsSwitch,
    ZsScrollbar,
    ZsSelectMenu,
    ZsOptionGroup,
    ZsOption,
    ZsSelect,
    ZsForm,
    ZsFormItem,
    ZsRadio,
    ZsRadioGroup,
    ZsRadioButton,
    ZsCheckbox,
    ZsCheckboxGroup,
    ZsPopover,
    ZsPagination,
    ZsTable,
    ZsSteps,
    ZsStep,
    ZsBreadcrumb,
    ZsBreadcrumbItem,
    datePicker
];

const ZsUI = function (Vue, opts = {}) {

    if (ZsUI.installed) return;

    components.map(component => {
        Vue.component(component.name, component);
    });

    Vue.prototype.$loading = Loading.service;
    Vue.prototype.$notice = Notice.service;
    Vue.prototype.$message = Message.service;
    Vue.prototype.$alert = MessageBox.service.alert;
    Vue.prototype.$confirm = MessageBox.service.confirm;
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default ZsUI;
export {
    ZsIcon,
    Loading,
    Notice,
    Message,
    MessageBox,
    ZsDialog,
    ZsButton,
    ZsButtonGroup,
    ZsInput,
    ZsInputNumber,
    ZsTag,
    ZsSwitch,
    ZsScrollbar,
    ZsSelectMenu,
    ZsOptionGroup,
    ZsOption,
    ZsSelect,
    ZsForm,
    ZsFormItem,
    ZsRadio,
    ZsRadioGroup,
    ZsRadioButton,
    ZsCheckbox,
    ZsCheckboxGroup,
    ZsPopover,
    ZsPagination,
    ZsTable,
    ZsSteps,
    ZsStep,
    ZsBreadcrumb,
    ZsBreadcrumbItem,
    datePicker
};
