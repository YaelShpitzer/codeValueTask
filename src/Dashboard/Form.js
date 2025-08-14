import { useState, useEffect, useCallback } from 'react';
import TextBox from 'devextreme-react/text-box';
import { Button } from 'devextreme-react/button';
import NumberBox from 'devextreme-react/number-box';
import { addProduct, editProduct } from '../Service/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router";
import TextArea from 'devextreme-react/text-area';
import { toast } from 'react-toastify';
import './index.css';

const Form = ({ product, hideForm }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [validError, setValidError] = useState('');
    const [img, setImg] = useState('')
    const products = useSelector((state) => state.products?.items);
    const dispatch = useDispatch();
    let params = useParams();
    const navigate = useNavigate();

    const onSuccessMessage = () => toast.success(params?.id ? 'Product updated in success' : 'Product added in success');

    const initForm = useCallback((selectedProduct = product) => {
        setName(selectedProduct?.name || '');
        setDescription(selectedProduct?.description || '')
        setPrice(selectedProduct?.price || '');
        setImg(selectedProduct?.img || '')
        setValidError('')
    }, [product])

    useEffect(() => {
        let selectedProduct
        if (params?.id && !product && products.length > 0) {
            selectedProduct = params?.id && products?.find(product => product?.id === Number(params.id))
        }
        initForm(selectedProduct)
    }, [products, params, product, initForm])

    const handleSubmit = () => {
        let error = ''
        if (!name) error = 'Name of product is required.';
        if (!description) error = 'Description of product is required.';
        if (!price || price <= 0) error = 'Price is required, should be more than 0';
        if (error) {
            setValidError(error)
            return
        }
        validError && setValidError('');

        const body = {
            createdDate: new Date(),
            ...(product && product),
            name,
            description,
            price,

        }
        onSuccessMessage('dfs')
        dispatch(product ? editProduct(body) : addProduct(body))
        navigate('/products')
        hideForm()
    }

    return (
        <div className='form-product'>
            <div> <Button icon="close" onClick={() => { hideForm(); navigate('/products') }} />
                <div style={{ minHeight: 145 }}>{img && <img src={require(`../Assets/img/${img}`)} alt={img} />}</div>
                <div className='field'>
                    <label >Name</label>
                    <TextBox
                        value={name}
                        onValueChanged={e => setName(e.value)}
                    />
                </div>
                <div className='field'>
                    <label>Description</label>
                    <TextArea
                        value={description}
                        onValueChanged={e => setDescription(e.value)}
                    />
                </div>
                <div className='field'>
                    <label>Price</label>
                    <NumberBox
                        value={price}
                        onValueChanged={e => setPrice(e.value)}
                    />
                </div>
                {validError && <div className='error'>{validError}</div>}</div>
            <div><button className="button" onClick={handleSubmit}>Save</button></div>
        </div>
    )
}

export default Form