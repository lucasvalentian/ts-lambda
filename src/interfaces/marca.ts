import { APIGatewayProxyEvent } from 'aws-lambda';

export interface MyMarca extends APIGatewayProxyEvent{

    pathParameters: {

        id:string;
        nombre: string;
        descripcion:string;
       
    };
}


export interface MarcaData {
    id: string;
    nombre: string;
    descripcion: string;
    createAt: number;
  }