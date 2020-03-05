function convertArrayOfObjectsTotsv(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || '\t';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }


    function downloadtsv(args) {  
        var data, filename, link;
        var tsv = convertArrayOfObjectsTotsv({
            data: gsheet
        });
        if (tsv == null) return;

        filename = args.filename || 'export.tsv';

        if (!tsv.match(/^data:text\/tsv/i)) {
            tsv = 'data:text/tsv;charset=utf-8,' + tsv;
        }
        data = encodeURI(tsv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }