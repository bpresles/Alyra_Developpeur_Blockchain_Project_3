import { Alert, Snackbar } from "@mui/material";

const SnackbarAlert = ({open, setOpen, message, severity}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            open={open}
            onClose={handleClose}
            autoHideDuration={6000}>
            <Alert severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarAlert;