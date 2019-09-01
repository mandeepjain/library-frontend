import { toast } from 'react-toastify';

// Toast duration constants
const SHORT = 2000;

class Toast {
  show = (msgKey) => {
    toast.success(msgKey, SHORT);
  };

  error = (msgKey) => {
    toast.error(msgKey, SHORT);
  }
}

const _toast = new Toast();

export default {
  show: _toast.show,
  error: _toast.error,
};
