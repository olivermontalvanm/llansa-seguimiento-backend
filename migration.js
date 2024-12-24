const xlsx = require('xlsx');
const path = require('path');
const dayjs = require( "dayjs" );
const _ = require( "lodash" );

function stringToNumber(input) {
  // Remove commas and parse the string as a float
  let r = parseFloat(input.replace(/,/g, ''));

  if( isNaN( r ) ) r = 0;

  return r;
}

// Function to read data from an Excel file
function readExcelFile(filePath) {
  try {
    const fieldMapping = {
      reqNumber: "No. Pedido",
      project: "Proyecto",
      reqDate: "Fecha Pedido",
      item: "Descripción",
      quantity: "Cantidad",
      measureUnit: "U/M",
      activity: "Actividad",
      costStatus: "COSTOS",
      dateReceived: "Fecha Recibido",
      status: "ESTADO",
      responsible: "Responsable",
      finishDate: "Fecha de Finalización",
      administration: "ADMINISTRACION",
      dueDate: "Programación de Entrega",
      pendingDays: "Días Pendiente de Entrega",
      processTotalDuration: "Duración total del proceso",
      notes: "OBSERVACIONES"
    };

    // Load the Excel file
    const workbook = xlsx.readFile(filePath);

    // Select the first sheet in the workbook
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false, defval: null, blankrows: false });
    let headerIndex = null;

    try {
      //  Find header row
      const maxRowLook = 25;
      for( let i = 0; i < data.length; i++) {
        const row = data[ i ];
        const rowValues = Object.values( row );
        let isHeader = false;

        for( let j = 0; j < rowValues.length; j++ ) {
          const val = rowValues[ j ];
          if( val != Object.values( fieldMapping )[ j ] )
            continue;

          isHeader = true;
        }

        if( isHeader ) {
          headerIndex = i;
          i = data.length;
        }
        
        if( !isHeader && i < maxRowLook )
          continue;

        if( i == maxRowLook ) throw new Error( `Could not find header row after looking into ${ maxRowLook } items.` );
      }
    } catch ( e ) {
      console.debug( e );
      process.exit( );
    }

    const parsedData = data.slice( ( headerIndex + 1)).map( d => {
      const o = {};
      let i = 0;

      for( const v of Object.values( d ) ) {
        o[ Object.keys( fieldMapping )[ i ] ] = v
        i++;
      }

      return o;
    } ); 

    const filteredData = parsedData.filter( p => p.reqNumber !== null ).map( row => {
      const newObj = Object.assign( {}, row );

      newObj.costStatus = row?.costStatus ? row.costStatus.trim( ) : null;
      newObj.reqDate = row?.reqDate ? dayjs( row.reqDate ).toDate( ) : null;
      newObj.dueDate = row?.dueDate ? dayjs( row.dueDate ).toDate( ) : null;
      newObj.dateReceived = row?.dateReceived ? dayjs( row.dateReceived ).toDate( ) : null;
      newObj.finishedDate = row?.finishedDate ? dayjs( row.finishedDate ).toDate( ) : null;
      newObj.pendingDays = row?.pendingDays ? stringToNumber( row.pendingDays ) : 0;
      newObj.quantity = row?.quantity ? stringToNumber( row.quantity ) : 0;
      newObj.processTotalDuration = row?.processTotalDuration ? stringToNumber( row.processTotalDuration ) : 0;

      return newObj;
    });

    if( !Array.isArray( filteredData ) ) throw new Error( "Result is not an array" );

    if( filteredData.length < 1 ) {
      console.info( "Did not find any data" );
      process.exit( 0 );
    }

    return filteredData;
  } catch (error) {
    console.error('Error reading the Excel file:', error);
  }
}

function transformData( rows ) {
  const projects = _.groupBy( rows, "activity" );

  console.debug( Object.keys( projects ) );
  console.debug( rows[ 0 ] );
  
}

function main( ) {
  const filePath = path.resolve(__dirname, './test_data/Pista Juan Pablo II SPC.xlsx');
  const parsedData = transformData( readExcelFile( filePath ) );
}

main( );

