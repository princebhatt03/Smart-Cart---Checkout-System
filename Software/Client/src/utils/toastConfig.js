import { toast } from 'react-toastify';

export const showSuccessToast = message => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};

export const showErrorToast = message => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};
