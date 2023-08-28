'use strict';
import { v4 as uuidv4 } from 'uuid';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { getAllMarcas, getMarcaById, saveMarca } from '../model/model-marca';
import * as validator from '../validator/uuidRegex';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

//INTERFACE
import {MyMarca,MarcaData} from '../interfaces/marca'


/**
* Funcion cosumo-api: Maneja la lógica para pode realizar peticiones get de todas las marcas
* 
*/

export const serviceGetAllMarcas = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log('GetMarcas INIT');
    const marcas = await getAllMarcas();
    console.log('Lista de Marcas ', marcas);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Datos Cargados Correctamente',
        data: marcas
      })
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Error al cargar los datos de la Marca',
        error: error
      })
    };
  }
};

/**
* Funcion cosumo-api: Maneja la lógica para pode realizar peticiones get de una Marca Especifica
* 
*/

export const serviceGetMarca = async (event: MyMarca): Promise<APIGatewayProxyResult> => {
  try {
    console.log('GetMarca INIT');

    const { id } = event.pathParameters;

    // Validar si el ID es un UUID válido
    if (!validator.validateUUID(id)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'El ID ingresado no es válido'
        })
      };
    }

    // Obtener la marca desde la base de datos
    const result = await getMarcaById(id);

    console.log('Data ', result);

    // Validar si la marca existe
    if (!result) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'La marca no existe'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Datos Cargados Correctamente',
        data: result
      })
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Error al cargar los datos',
        error: error
      })
    };
  }
};

/**
* Funcion cosumo-api: Maneja la lógica para poder guardar las marcas
* 
*/


export const servicePostMarca = async (event: MyMarca): Promise<APIGatewayProxyResult> => {

  try {
    console.log('postMarca INIT');

     // Verificar si event.body existe y no es null
     if (!event.body) {
      throw new Error('Cuerpo de la solicitud faltante');
    }
    
    const parsedBody: MarcaData = JSON.parse(event.body);
    const { nombre, descripcion } = parsedBody;

    if (!event.body || !nombre || !descripcion) {
      throw new Error('Parámetros faltantes o incorrectos');
    }

    console.log('Data de Input ', nombre, descripcion);

    const createAt = new Date().getTime();
    const id = uuidv4();
    console.log('ID ', id);

    const marca:MarcaData = {
      id:id,
      nombre:nombre,
      descripcion:descripcion,
      createAt:createAt
    };

    // GUARDAR LOS DATOS
    await saveMarca(marca);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Almacenado Correctamente',
        data: marca
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Error al guardar los datos',
        error: error
      })
    };
  }
};



