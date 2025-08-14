import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextBox from 'devextreme-react/text-box';
import SelectBox from 'devextreme-react/select-box';
import { fetchProducts, removeProduct } from '../Service/productsSlice';
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from 'react-toastify';
import Form from './Form';
import './index.css';
import { Button } from 'devextreme-react/button';

const Dashboard = () => {
    const [isShowForm, setIsShowForm] = useState();
    const [selectedProduct, setSelectedProduct] = useState();
    const [filterValue, setFilterValue] = useState('')
    const [sortBy, setSortBy] = useState();
    const [page, setPage] = useState(1);
    const products = useSelector((state) => state.products?.items);
    const status = useSelector((state) => state.products.status);
    const error = useSelector((state) => state.products.error);
    const navigate = useNavigate();
    let params = useParams();
    const dispatch = useDispatch();

    const sortData = useMemo(() => {
        let productsList = [...products]
        if (filterValue) productsList = productsList.filter(product => (product?.name?.toUpperCase().includes(filterValue.toUpperCase())
            || product?.description?.toUpperCase()?.includes(filterValue.toUpperCase())))
        if (sortBy === 1) productsList = productsList?.sort((a, b) => a.name.localeCompare(b.name))
        else if (sortBy === 2) productsList = productsList?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate))
        return productsList.slice((page - 1) * 5, page * 5)
    }, [products, sortBy, filterValue, page])

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const addProduct = useCallback(() => {
        setIsShowForm(true)
        setSelectedProduct();
        navigate(`/products`)
    }, [navigate])

    const handleSelectProduct = useCallback((product) => {
        setSelectedProduct(product)
        setIsShowForm(true)
        navigate(`/products/${product?.id}`)
    }, [navigate])

    const HideForm = useCallback(() => {
        setIsShowForm(false)
        setSelectedProduct()
        navigate(`/products`)
    }, [navigate])

    const handleDeleteProduct = useCallback((product) => {
        selectedProduct?.id === product?.id && HideForm()
        dispatch(removeProduct(product.id))
    }, [selectedProduct, HideForm, dispatch])

    const handlePagin = useCallback((action) => {
        setPage(prev => prev + action)
        params?.id && HideForm()
    }, [params.id, HideForm])

    if (status === 'loading') return <div>טוען...</div>;
    if (status === 'failed') return <div>שגיאה: {error}</div>;

    return (<div >
        <div className='title'><h2 >My store</h2></div>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <div className='header'>

            <button className="button" onClick={addProduct}>Add</button>
            <div className='wrapperFilter'>
                <label>Filter</label>
                <TextBox
                    value={filterValue}
                    onValueChanged={e => setFilterValue(e.value)}
                />
            </div>
            <div className='wrapperFilter'>
                <label>Sort by </label>
                <SelectBox
                    items={[{ key: 1, text: 'Product name' }, { key: 2, text: 'Creation date' }]}
                    placeholder="Choose Product"
                    valueExpr="key"
                    value={sortBy}
                    displayExpr="text"
                    showClearButton={true}
                    onValueChange={(val) => setSortBy(val)}
                    width={'200px'}
                />
            </div>
        </div>
        <div className='products-wrapper'>
            <div className='products-list'>
                {sortData.map((product, index) =>
                    <div key={index} className='product'>
                        <div className='details-product' onClick={() => handleSelectProduct(product)}>
                            <img src={product.img ? require(`../Assets/img/${product.img}`) : ''} alt={product.img} />
                            <div><div>{product.name}</div>
                                <div>{product.description}</div>

                            </div>
                        </div>
                        <button className="button" onClick={() => handleDeleteProduct(product)}>Delete</button>
                    </div>
                )}
                {products?.length > 5 && <div className='pagination'>
                    <Button text="Prev" icon="chevronleft" disabled={page === 1} onClick={() => handlePagin(-1) }/>
                    <span>{`${page} of ${Math.ceil(products.length / 5)}`}</span>
                    <Button text="Next" icon="chevronnext" disabled={page === Math.ceil(products.length / 5)} onClick={() => handlePagin(+1)} />
                </div>}
            </div>
            {(isShowForm || params?.id) && <Form product={selectedProduct} hideForm={() => setIsShowForm(false)} />}
        </div>
    </div>)
}

export default Dashboard