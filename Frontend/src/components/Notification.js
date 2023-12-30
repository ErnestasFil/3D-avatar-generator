import { enqueueSnackbar } from 'notistack';
const Notification = (message, title, variant, autoHideDuration) => {
    const content = (
        <div>
            <b>{title}</b>
            <br />
            {message}
        </div>
    );
    enqueueSnackbar(content, {
        autoHideDuration: autoHideDuration || 3000,
        variant: variant || 'info',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' }
    });
};

export default Notification;
