const xlsx = require('xlsx');
const path = require('path');

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

    // TODO Know from which row the data actually starts
    /**
     * Its necessary to find out where the header is and where
     * the data starts.
     */

    const parsedData = data.slice( ( headerIndex + 1)).map( d => {
      const o = {};
      let i = 0;

      for( const v of Object.values( d ) ) {
        o[ Object.keys( fieldMapping )[ i ] ] = v
        i++;
      }

      return o;
    } ); 

    const filteredData = parsedData.filter( p => p.reqNumber !== null );

    return filteredData;
  } catch (error) {
    console.error('Error reading the Excel file:', error);
  }
}

// Path to the Excel file
const filePath = path.resolve(__dirname, './test_data/Pista Juan Pablo II SPC.xlsx');

// Fetch and display data from the Excel file
const data = readExcelFile(filePath);

console.debug( data );

