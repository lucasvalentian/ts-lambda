import * as AWS from 'aws-sdk';
import {MyMarca,MarcaData} from '../interfaces/marca'
// Función para poder consultar todos los datos de la tabla MarcaTable
const getAllMarcas = async () => {

     
  const params = {
    TableName: 'MarcaTable',
  };

  const dynamodb=new AWS.DynamoDB.DocumentClient();
  const result = await dynamodb.scan(params).promise();
  const marcas = result.Items;
  return marcas as MarcaData[];

  


};

// Función para poder consultar una marca específica por ID
const getMarcaById = async (id: string) => {

  const dynamodb=new AWS.DynamoDB.DocumentClient();
  const result = await dynamodb.get({
    TableName: 'MarcaTable',
    Key: {
      id: id
    }
  }).promise();

  return result.Item as MarcaData;


};

// Función para poder guardar los datos en la tabla
const saveMarca = async (marca: MarcaData) => {
  const dynamodb=new AWS.DynamoDB.DocumentClient();

  await dynamodb.put({
    TableName:'MarcaTable',
    Item:marca
 }).promise()
};

export { getAllMarcas, getMarcaById, saveMarca };
