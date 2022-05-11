const FormItemLayout = (labelCol_xs, labelCol_sm, wrapperCol_xs, wrapperCol_sm) => {
    return {
        labelCol: {
            xs: {
                span: labelCol_xs,
            },
            sm: {
                span: labelCol_sm,
            },
        },
        wrapperCol: {
            xs: {
                span: wrapperCol_xs,
            },
            sm: {
                span: wrapperCol_sm,
            },
        },
    }
};

export default FormItemLayout;