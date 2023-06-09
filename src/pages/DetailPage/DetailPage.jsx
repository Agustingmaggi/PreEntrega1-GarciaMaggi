import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CardPlayer from "../../components/CardPlayer/CardPlayer.jsx";
import "./detail.css";
import { ProductosContext } from "../../context/ProductosContext";
import {
    collection,
    query,
    where,
    getDocs,
    documentId,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const DetailPage = () => {
    const [producto, setProducto] = useState([]);
    const { id } = useParams();
    const [items, setItems] = useContext(ProductosContext);
    const [cantidad, setCantidad] = useState(0);
    const [mensajeCarrito, setMensajeCarrito] = useState(null);
    const [carritoClicked, setCarritoClicked] = useState(false);
    const [loading, setLoading] = useState(true); // Bandera de carga

    useEffect(() => {
        const getproductos = async () => {
            const q = query(collection(db, "productos"), where(documentId(), "==", id));
            const docs = [];
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            setProducto(docs);
            setLoading(false);
        };
        getproductos();
    }, [id]);

    const incrementarCantidad = () => {
        setCantidad(cantidad + 1);
    };

    const decrementarCantidad = () => {
        if (cantidad >= 1) {
            setCantidad(cantidad - 1);
        }
    };

    const agregarAlCarrito = () => {
        if (cantidad > 0) {
            const productoSeleccionado = producto[0];
            const itemCarrito = {
                img: productoSeleccionado.img,
                clasificacion: productoSeleccionado.clasificacion,
                nombre: productoSeleccionado.nombre,
                precio: productoSeleccionado.precio,
                cantidad: cantidad,
            };
            setItems((prevItems) => [...prevItems, itemCarrito]);
            setMensajeCarrito(`¡Enhorabuena! Has agregado este producto al carrito`);
            setCarritoClicked(true);

            setTimeout(() => {
                setCarritoClicked(false);
            }, 100);
        } else {
            setMensajeCarrito("Tienes que agregar al carrito al menos 1 producto.");
        }
    };

    if (loading) {
        return (
            <div className="detalle-prod">
                <p>Cargando...</p>
            </div>
        );
    }

    if (producto.length === 0) {
        return (
            <div className="detalle-prod">
                <p>Lo sentimos, ese producto no existe.</p>
            </div>
        );
    }

    return (
        <div className="detalle-prod">
            {producto.map((prod) => {
                return (
                    <div className="detalle-prod" key={prod.id}>
                        <CardPlayer data={prod} showDescription={true} />

                        <div className="cantidad-container">
                            <button onClick={decrementarCantidad} className="button">-</button>
                            <span>{cantidad}</span>
                            <button onClick={incrementarCantidad} className="button">+</button>
                            <button
                                onClick={() => agregarAlCarrito()}
                                className={`button ${carritoClicked ? "button-clicked" : ""}`}
                            >
                                Agregar al carrito
                            </button>
                        </div>

                        {mensajeCarrito && (
                            <p className="mensaje-carrito">{mensajeCarrito}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DetailPage;