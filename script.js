document.addEventListener('DOMContentLoaded', () => {
    const gedcomFile = document.getElementById('gedcomFile');
    const loadSampleButton = document.getElementById('loadSampleButton');
    const resultsDiv = document.getElementById('results');
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');

    gedcomFile.addEventListener('change', () => {
        resultsDiv.innerHTML = ''; // Clear previous results
        progressBar.value = 0;
        statusMessage.textContent = 'Starting upload...';

        const file = gedcomFile.files[0];
        if (!file) {
            resultsDiv.innerHTML = '<p style="color: red;">Please select a GEDCOM file.</p>';
            statusMessage.textContent = 'No file selected.';
            return;
        }

        const reader = new FileReader();

        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                progressBar.value = percent;
                statusMessage.textContent = `Uploading: ${percent.toFixed(2)}%`;
            }
        };

        reader.onload = (e) => {
            statusMessage.textContent = 'File uploaded. Analyzing...';
            progressBar.value = 100;
            const gedcomContent = e.target.result;
            try {
                const report = analyzeGedcom(gedcomContent);
                displayReport(report);
                statusMessage.textContent = 'Analysis complete!';
            } catch (error) {
                resultsDiv.innerHTML = `<p style="color: red;">Error processing GEDCOM file: ${error.message}</p>`;
                statusMessage.textContent = `Error: ${error.message}`;
                console.error("GEDCOM processing error:", error);
            }
        };
        reader.onerror = () => {
            resultsDiv.innerHTML = '<p style="color: red;">Error reading file.</p>';
            statusMessage.textContent = 'Error reading file.';
        };
        reader.readAsText(file);
    });

    const sampleGedcomData = `0 HEAD
1 CHAR UTF-8
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 SUBM @SUBM@
0 @SUBM@ SUBM
1 NAME Gemini CLI

0 @I1@ INDI
1 NAME Queen Victoria
1 SEX F
1 BIRT
2 DATE 24 MAY 1819
1 DEAT
2 DATE 22 JAN 1901
1 FAMS @F1@

0 @I2@ INDI
1 NAME Prince Albert
1 SEX M
1 BIRT
2 DATE 26 AUG 1819
1 DEAT
2 DATE 14 DEC 1861
1 FAMS @F1@

0 @I3@ INDI
1 NAME Edward VII
1 SEX M
1 BIRT
2 DATE 09 NOV 1841
1 DEAT
2 DATE 06 MAY 1910
1 FAMC @F1@
1 FAMS @F2@

0 @I4@ INDI
1 NAME Alexandra of Denmark
1 SEX F
1 BIRT
2 DATE 01 DEC 1844
1 DEAT
2 DATE 20 NOV 1925
1 FAMS @F2@

0 @I5@ INDI
1 NAME George V
1 SEX M
1 BIRT
2 DATE 03 JUN 1865
1 DEAT
2 DATE 20 JAN 1936
1 FAMC @F2@
1 FAMS @F3@

0 @I6@ INDI
1 NAME Mary of Teck
1 SEX F
1 BIRT
2 DATE 26 MAY 1867
1 DEAT
2 DATE 24 MAR 1953
1 FAMS @F3@

0 @I7@ INDI
1 NAME Edward VIII
1 SEX M
1 BIRT
2 DATE 23 JUN 1894
1 DEAT
2 DATE 28 MAY 1972
1 FAMC @F3@

0 @I8@ INDI
1 NAME George VI
1 SEX M
1 BIRT
2 DATE 14 DEC 1895
1 DEAT
2 DATE 06 FEB 1952
1 FAMC @F3@
1 FAMS @F4@

0 @I9@ INDI
1 NAME Elizabeth Bowes-Lyon
1 SEX F
1 BIRT
2 DATE 04 AUG 1900
1 DEAT
2 DATE 30 MAR 2002
1 FAMS @F4@

0 @I10@ INDI
1 NAME Elizabeth II
1 SEX F
1 BIRT
2 DATE 21 APR 1926
1 FAMS @F5@
1 FAMC @F4@

0 @I11@ INDI
1 NAME Philip Mountbatten
1 SEX M
1 BIRT
2 DATE 10 JUN 1921
1 DEAT
2 DATE 09 APR 2021
1 FAMS @F5@

0 @I12@ INDI
1 NAME Charles III
1 SEX M
1 BIRT
2 DATE 14 NOV 1948
1 FAMC @F5@
1 FAMS @F6@
1 FAMS @F7@

0 @I13@ INDI
1 NAME Diana Spencer
1 SEX F
1 BIRT
2 DATE 01 JUL 1961
1 DEAT
2 DATE 31 AUG 1997
1 FAMS @F6@

0 @I14@ INDI
1 NAME Camilla Shand
1 SEX F
1 BIRT
2 DATE 17 JUL 1947
1 FAMS @F7@

0 @I15@ INDI
1 NAME William
1 SEX M
1 BIRT
2 DATE 21 JUN 1982
1 FAMC @F6@
1 FAMS @F8@

0 @I16@ INDI
1 NAME Catherine Middleton
1 SEX F
1 BIRT
2 DATE 09 JAN 1982
1 FAMS @F8@

0 @I17@ INDI
1 NAME George
1 SEX M
1 BIRT
2 DATE 22 JUL 2013
1 FAMC @F8@

0 @I18@ INDI
1 NAME Charlotte
1 SEX F
1 BIRT
2 DATE 02 MAY 2015
1 FAMC @F8@

0 @I19@ INDI
1 NAME Louis
1 SEX M
1 BIRT
2 DATE 23 APR 2018
1 FAMC @F8@

0 @I20@ INDI
1 NAME Harry
1 SEX M
1 BIRT
2 DATE 15 SEP 1984
1 FAMC @F6@
1 FAMS @F9@

0 @I21@ INDI
1 NAME Meghan Markle
1 SEX F
1 BIRT
2 DATE 04 AUG 1981
1 FAMS @F9@

0 @I22@ INDI
1 NAME Archie Mountbatten-Windsor
1 SEX M
1 BIRT
2 DATE 06 MAY 2019
1 FAMC @F9@

0 @I23@ INDI
1 NAME Lilibet Mountbatten-Windsor
1 SEX F
1 BIRT
2 DATE 04 JUN 2021
1 FAMC @F9@

0 @I24@ INDI
1 NAME Anne
1 SEX F
1 BIRT
2 DATE 15 AUG 1950
1 FAMC @F5@

0 @I25@ INDI
1 NAME Andrew
1 SEX M
1 BIRT
2 DATE 19 FEB 1960
1 FAMC @F5@

0 @I26@ INDI
1 NAME Edward
1 SEX M
1 BIRT
2 DATE 10 MAR 1964
1 FAMC @F5@

0 @I27@ INDI
1 NAME Victoria
1 SEX F
1 BIRT
2 DATE 21 NOV 1840
1 DEAT
2 DATE 05 AUG 1901
1 FAMC @F1@
1 FAMS @F10@

0 @I28@ INDI
1 NAME Frederick III
1 SEX M
1 BIRT
2 DATE 18 OCT 1831
1 DEAT
2 DATE 15 JUN 1888
1 FAMS @F10@

0 @I29@ INDI
1 NAME Wilhelm II
1 SEX M
1 BIRT
2 DATE 27 JAN 1859
1 DEAT
2 DATE 04 JUN 1941
1 FAMC @F10@
1 FAMS @F11@

0 @I30@ INDI
1 NAME Augusta Victoria
1 SEX F
1 BIRT
2 DATE 22 OCT 1858
1 DEAT
2 DATE 11 APR 1921
1 FAMS @F11@

0 @I31@ INDI
1 NAME Wilhelm
1 SEX M
1 BIRT
2 DATE 06 MAY 1882
1 DEAT
2 DATE 20 JUL 1951
1 FAMC @F11@
1 FAMS @F12@

0 @I32@ INDI
1 NAME Cecilie of Mecklenburg-Schwerin
1 SEX F
1 BIRT
2 DATE 20 SEP 1886
1 DEAT
2 DATE 06 MAY 1954
1 FAMS @F12@

0 @I33@ INDI
1 NAME Louis Ferdinand
1 SEX M
1 BIRT
2 DATE 09 NOV 1907
1 DEAT
2 DATE 25 SEP 1994
1 FAMC @F12@

0 @I34@ INDI
1 NAME Kira Kirillovna
1 SEX F
1 BIRT
2 DATE 09 MAY 1909
1 DEAT
2 DATE 08 SEP 1967
1 FAMS @F13@

0 @I35@ INDI
1 NAME Philip
1 SEX M
1 BIRT
2 DATE 10 JUN 1921
1 DEAT
2 DATE 09 APR 2021
1 FAMC @F13@

0 @I36@ INDI
1 NAME Sophie
1 SEX F
1 BIRT
2 DATE 26 JUN 1914
1 DEAT
2 DATE 24 NOV 2001
1 FAMS @F14@

0 @I37@ INDI
1 NAME Christoph
1 SEX M
1 BIRT
2 DATE 14 MAY 1901
1 DEAT
2 DATE 07 OCT 1943
1 FAMS @F14@

0 @I38@ INDI
1 NAME George
1 SEX M
1 BIRT
2 DATE 06 NOV 1911
1 DEAT
2 DATE 29 OCT 1966
1 FAMC @F14@

0 @I39@ INDI
1 NAME Margarita
1 SEX F
1 BIRT
2 DATE 18 APR 1905
1 DEAT
2 DATE 24 APR 1981
1 FAMS @F15@

0 @I40@ INDI
1 NAME Gottfried
1 SEX M
1 BIRT
2 DATE 24 MAY 1897
1 DEAT
2 DATE 11 MAY 1970
1 FAMS @F15@

0 @I41@ INDI
1 NAME Cecilie
1 SEX F
1 BIRT
2 DATE 22 JUN 1911
1 DEAT
2 DATE 16 NOV 1937
1 FAMC @F15@

0 @I42@ INDI
1 NAME Berthold
1 SEX M
1 BIRT
2 DATE 24 FEB 1906
1 DEAT
2 DATE 27 OCT 1963
1 FAMS @F16@

0 @I43@ INDI
1 NAME Theodora
1 SEX F
1 BIRT
2 DATE 30 MAY 1906
1 DEAT
2 DATE 16 OCT 1969
1 FAMS @F16@

0 @I44@ INDI
1 NAME Maximilian
1 SEX M
1 BIRT
2 DATE 13 JUL 1904
1 DEAT
2 DATE 10 JAN 1966
1 FAMC @F16@

0 @I45@ INDI
1 NAME Marie Louise
1 SEX F
1 BIRT
2 DATE 24 OCT 1872
1 DEAT
2 DATE 08 DEC 1956
1 FAMC @F1@
1 FAMS @F17@

0 @I46@ INDI
1 NAME Aribert of Anhalt
1 SEX M
1 BIRT
2 DATE 18 JUN 1866
1 DEAT
2 DATE 24 DEC 1933
1 FAMS @F17@

0 @I47@ INDI
1 NAME Helena
1 SEX F
1 BIRT
2 DATE 25 MAY 1846
1 DEAT
2 DATE 09 JUN 1923
1 FAMC @F1@
1 FAMS @F18@

0 @I48@ INDI
1 NAME Christian of Schleswig-Holstein
1 SEX M
1 BIRT
2 DATE 22 JAN 1831
1 DEAT
2 DATE 28 OCT 1917
1 FAMS @F18@

0 @I49@ INDI
1 NAME Albert
1 SEX M
1 BIRT
2 DATE 26 FEB 1869
1 DEAT
2 DATE 13 MAR 1931
1 FAMC @F18@

0 @I50@ INDI
1 NAME Leopold
1 SEX M
1 BIRT
2 DATE 07 APR 1853
1 DEAT
2 DATE 28 MAR 1884
1 FAMC @F1@
1 FAMS @F19@

0 @I51@ INDI
1 NAME Helena of Waldeck and Pyrmont
1 SEX F
1 BIRT
2 DATE 17 FEB 1861
1 DEAT
2 DATE 01 SEP 1922
1 FAMS @F19@

0 @I52@ INDI
1 NAME Alice
1 SEX F
1 BIRT
2 DATE 25 FEB 1883
1 DEAT
2 DATE 03 JAN 1981
1 FAMC @F19@
1 FAMS @F20@

0 @I53@ INDI
1 NAME Alexander of Teck
1 SEX M
1 BIRT
2 DATE 14 APR 1874
1 DEAT
2 DATE 29 JAN 1957
1 FAMS @F20@

0 @I54@ INDI
1 NAME May
1 SEX F
1 BIRT
2 DATE 23 JAN 1906
1 DEAT
2 DATE 29 JAN 1994
1 FAMC @F20@

0 @I55@ INDI
1 NAME Charles Edward
1 SEX M
1 BIRT
2 DATE 19 JUL 1884
1 DEAT
2 DATE 18 JUN 1954
1 FAMC @F19@

0 @I56@ INDI
1 NAME Beatrice
1 SEX F
1 BIRT
2 DATE 14 APR 1857
1 DEAT
2 DATE 26 OCT 1944
1 FAMC @F1@
1 FAMS @F21@

0 @I57@ INDI
1 NAME Henry of Battenberg
1 SEX M
1 BIRT
2 DATE 05 OCT 1858
1 DEAT
2 DATE 20 JAN 1896
1 FAMS @F21@

0 @I58@ INDI
1 NAME Victoria Eugenie
1 SEX F
1 BIRT
2 DATE 24 OCT 1887
1 DEAT
2 DATE 15 APR 1969
1 FAMC @F21@

0 @I59@ INDI
1 NAME Leopold
1 SEX M
1 BIRT
2 DATE 21 MAY 1889
1 DEAT
2 DATE 21 APR 1922
1 FAMC @F21@

0 @I60@ INDI
1 NAME Maurice
1 SEX M
1 BIRT
2 DATE 03 OCT 1891
1 DEAT
2 DATE 13 SEP 1914
1 FAMC @F21@

0 @I61@ INDI
1 NAME Ernest Augustus
1 SEX M
1 BIRT
2 DATE 21 SEP 1845
1 DEAT
2 DATE 14 NOV 1923
1 FAMC @F1@
1 FAMS @F22@

0 @I62@ INDI
1 NAME Thyra of Denmark
1 SEX F
1 BIRT
2 DATE 29 SEP 1853
1 DEAT
2 DATE 26 FEB 1933
1 FAMS @F22@

0 @I63@ INDI
1 NAME George William
1 SEX M
1 BIRT
2 DATE 28 OCT 1880
1 DEAT
2 DATE 20 MAY 1912
1 FAMC @F22@

0 @I64@ INDI
1 NAME Christian
1 SEX M
1 BIRT
2 DATE 29 SEP 1885
1 DEAT
2 DATE 03 FEB 1901
1 FAMC @F22@

0 @I65@ INDI
1 NAME Alexandra
1 SEX F
1 BIRT
2 DATE 29 SEP 1882
1 DEAT
2 DATE 30 AUG 1963
1 FAMC @F22@

0 @I66@ INDI
1 NAME Olga
1 SEX F
1 BIRT
2 DATE 11 JUL 1884
1 DEAT
2 DATE 21 SEP 1958
1 FAMC @F22@

0 @I67@ INDI
1 NAME Marie Louise
1 SEX F
1 BIRT
2 DATE 11 OCT 1879
1 DEAT
2 DATE 31 JAN 1948
1 FAMC @F22@

0 @I68@ INDI
1 NAME Victoria Louise
1 SEX F
1 BIRT
2 DATE 13 SEP 1892
1 DEAT
2 DATE 11 DEC 1980
1 FAMC @F11@
1 FAMS @F23@

0 @I69@ INDI
1 NAME Ernest Augustus
1 SEX M
1 BIRT
2 DATE 17 NOV 1887
1 DEAT
2 DATE 30 JAN 1953
1 FAMS @F23@

0 @I70@ INDI
1 NAME Frederick William
1 SEX M
1 BIRT
2 DATE 20 MAR 1912
1 DEAT
2 DATE 02 AUG 1988
1 FAMC @F23@

0 @I71@ INDI
1 NAME George William
1 SEX M
1 BIRT
2 DATE 25 MAR 1915
1 DEAT
2 DATE 08 JAN 2006
1 FAMC @F23@

0 @I72@ INDI
1 NAME Christian Louis
1 SEX M
1 BIRT
2 DATE 14 JUL 1919
1 DEAT
2 DATE 10 DEC 1981
1 FAMC @F23@

0 @I73@ INDI
1 NAME Welf Heinrich
1 SEX M
1 BIRT
2 DATE 11 MAR 1923
1 DEAT
2 DATE 12 JUL 1998
1 FAMC @F23@

0 @I74@ INDI
1 NAME Alexandra
1 SEX F
1 BIRT
2 DATE 18 SEP 1937
1 DEAT
2 DATE 25 JAN 2015
1 FAMC @F23@

0 @I75@ INDI
1 NAME Ernst August
1 SEX M
1 BIRT
2 DATE 26 FEB 1954
1 FAMC @F23@

0 @F1@ FAM
1 HUSB @I2@
1 WIFE @I1@
1 CHIL @I3@
1 CHIL @I27@
1 CHIL @I45@
1 CHIL @I47@
1 CHIL @I50@
1 CHIL @I56@
1 CHIL @I61@

0 @F2@ FAM
1 HUSB @I3@
1 WIFE @I4@
1 CHIL @I5@

0 @F3@ FAM
1 HUSB @I5@
1 WIFE @I6@
1 CHIL @I7@
1 CHIL @I8@

0 @F4@ FAM
1 HUSB @I8@
1 WIFE @I9@
1 CHIL @I10@

0 @F5@ FAM
1 HUSB @I11@
1 WIFE @I10@
1 CHIL @I12@
1 CHIL @I24@
1 CHIL @I25@
1 CHIL @I26@

0 @F6@ FAM
1 HUSB @I12@
1 WIFE @I13@
1 CHIL @I15@
1 CHIL @I20@

0 @F7@ FAM
1 HUSB @I12@
1 WIFE @I14@

0 @F8@ FAM
1 HUSB @I15@
1 WIFE @I16@
1 CHIL @I17@
1 CHIL @I18@
1 CHIL @I19@

0 @F9@ FAM
1 HUSB @I20@
1 WIFE @I21@
1 CHIL @I22@
1 CHIL @I23@

0 @F10@ FAM
1 HUSB @I28@
1 WIFE @I27@
1 CHIL @I29@

0 @F11@ FAM
1 HUSB @I29@
1 WIFE @I30@
1 CHIL @I31@
1 CHIL @I68@

0 @F12@ FAM
1 HUSB @I31@
1 WIFE @I32@
1 CHIL @I33@

0 @F13@ FAM
1 HUSB @I35@
1 WIFE @I34@

0 @F14@ FAM
1 HUSB @I37@
1 WIFE @I36@
1 CHIL @I38@

0 @F15@ FAM
1 HUSB @I40@
1 WIFE @I39@
1 CHIL @I41@

0 @F16@ FAM
1 HUSB @I42@
1 WIFE @I43@
1 CHIL @I44@

0 @F17@ FAM
1 HUSB @I46@
1 WIFE @I45@

0 @F18@ FAM
1 HUSB @I48@
1 WIFE @I47@
1 CHIL @I49@

0 @F19@ FAM
1 HUSB @I50@
1 WIFE @I51@
1 CHIL @I52@
1 CHIL @I55@

0 @F20@ FAM
1 HUSB @I53@
1 WIFE @I52@
1 CHIL @I54@

0 @F21@ FAM
1 HUSB @I57@
1 WIFE @I56@
1 CHIL @I58@
1 CHIL @I59@
1 CHIL @I60@

0 @F22@ FAM
1 HUSB @I61@
1 WIFE @I62@
1 CHIL @I63@
1 CHIL @I64@
1 CHIL @I65@
1 CHIL @I66@
1 CHIL @I67@

0 @F23@ FAM
1 HUSB @I69@
1 WIFE @I68@
1 CHIL @I70@
1 CHIL @I71@
1 CHIL @I72@
1 CHIL @I73@
1 CHIL @I74@
1 CHIL @I75@
`;

    loadSampleButton.addEventListener('click', () => {
        resultsDiv.innerHTML = ''; // Clear previous results
        progressBar.value = 0;
        statusMessage.textContent = 'Loading sample data...';
        try {
            const report = analyzeGedcom(sampleGedcomData);
            displayReport(report);
            statusMessage.textContent = 'Sample data analysis complete!';
        } catch (error) {
            resultsDiv.innerHTML = `<p style="color: red;">Error processing sample GEDCOM data: ${error.message}</p>`;
            statusMessage.textContent = `Error: ${error.message}`;
            console.error("Sample GEDCOM processing error:", error);
        }
    });

    function analyzeGedcom(gedcomContent) {
        // Basic GEDCOM parsing (simplified for demonstration)
        // In a real application, you'd use a robust GEDCOM parser library.
        const individuals = {};
        const families = {};

        const lines = gedcomContent.split(/\r?\n/);

        // First Pass: Identify all INDI and FAM records and initialize them
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            const parts = trimmedLine.match(/^(\d+)\s+(@[^@]+@)?\s*(\w+)(?:\s+(.*))?$/);
            if (!parts) return;

            const level = parseInt(parts[1]);
            const xrefId = parts[2];
            const tag = parts[3];

            if (level === 0) {
                if (tag === 'INDI') {
                    individuals[xrefId] = { id: xrefId, name: 'Unknown', sex: 'U', families: { spouse: [], child: [] } };
                } else if (tag === 'FAM') {
                    families[xrefId] = { id: xrefId, husband: null, wife: null, children: [] };
                }
            }
        });

        // Second Pass: Populate details and relationships
        let currentRecord = null;
        let currentRecordType = null;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            const parts = trimmedLine.match(/^(\d+)\s+(@[^@]+@)?\s*(\w+)(?:\s+(.*))?$/);
            if (!parts) {
                console.warn("Skipping malformed GEDCOM line during second pass:", trimmedLine);
                return;
            }

            const level = parseInt(parts[1]);
            const xrefId = parts[2];
            const tag = parts[3];
            const value = parts[4] ? parts[4].trim() : '';

            if (level === 0) {
                if (tag === 'INDI') {
                    currentRecordType = 'INDI';
                    currentRecord = xrefId;
                } else if (tag === 'FAM') {
                    currentRecordType = 'FAM';
                    currentRecord = xrefId;
                } else {
                    currentRecordType = null;
                    currentRecord = null;
                }
            }
            else if (currentRecordType === 'INDI' && currentRecord) {
                if (tag === 'NAME') {
                    individuals[currentRecord].name = value.replace(/\//g, '');
                } else if (tag === 'SEX') {
                    individuals[currentRecord].sex = value;
                } else if (tag === 'FAMS') { // Family as Spouse
                    individuals[currentRecord].families.spouse.push(value);
                } else if (tag === 'FAMC') { // Family as Child
                    individuals[currentRecord].families.child.push(value);
                }
            }
            else if (currentRecordType === 'FAM' && currentRecord) {
                // Inside a FAM record
                if (tag === 'HUSB') {
                    families[currentRecord].husband = value;
                } else if (tag === 'WIFE') {
                    families[currentRecord].wife = value;
                } else if (tag === 'CHIL') {
                    families[currentRecord].children.push(value);
                }
            }
        });

        // Build graph for analysis
        const graph = buildGraph(individuals, families);

        // Perform graph theory calculations
        const connectivity = calculateConnectivity(graph);
        const centrality = calculateCentrality(graph);
        const { mostAncestors, mostDescendants, allAncestorCounts, allDescendantCounts } = calculateAncestorsDescendants(graph, individuals);
        
        // Store ancestor and descendant counts directly on individual objects
        for (const id in individuals) {
            individuals[id].ancestorCount = allAncestorCounts[id] || 0;
            individuals[id].descendantCount = allDescendantCounts[id] || 0;
        }

        const diameter = calculateDiameter(graph);
        const longestPath = calculateLongestPath(graph);

        return {
            totalIndividuals: Object.keys(individuals).length,
            connectivity,
            centrality,
            mostAncestors,
            mostDescendants,
            diameter,
            longestPath,
            individuals: individuals
        };
    }

    function buildGraph(individuals, families) {
        const nodes = new Set();
        const adj = new Map(); // Adjacency list for directed graph
        const reverseAdj = new Map(); // Adjacency list for reverse graph (for ancestors)

        // Add all individuals as nodes and initialize their adjacency lists
        for (const id in individuals) {
            nodes.add(id);
            adj.set(id, new Set());
            reverseAdj.set(id, new Set());
        }

        // Add family relationships as directed edges
        for (const famId in families) {
            const family = families[famId];
            const husbandId = family.husband;
            const wifeId = family.wife;
            const childrenIds = family.children;

            // Link husband and wife (bidirectional for general connectivity)
            if (husbandId && wifeId) {
                if (nodes.has(husbandId) && nodes.has(wifeId)) {
                    adj.get(husbandId).add(wifeId);
                    adj.get(wifeId).add(husbandId);

                    reverseAdj.get(husbandId).add(wifeId);
                    reverseAdj.get(wifeId).add(husbandId);
                }
            }

            // Link parents to children (directed edges)
            childrenIds.forEach(childId => {
                if (nodes.has(childId)) {
                    if (husbandId && nodes.has(husbandId)) {
                        adj.get(husbandId).add(childId); // Parent -> Child
                        reverseAdj.get(childId).add(husbandId); // Child -> Parent
                    }
                    if (wifeId && nodes.has(wifeId)) {
                        adj.get(wifeId).add(childId); // Parent -> Child
                        reverseAdj.get(childId).add(wifeId); // Child -> Parent
                    }
                }
            });
        }

        return { nodes: Array.from(nodes), adj: adj, reverseAdj: reverseAdj };
    }

    function calculateConnectivity(graph) {
        const visited = new Set();
        let components = 0;

        function dfs(node) {
            visited.add(node);
            graph.adj.get(node).forEach(neighbor => {
                if (!visited.has(neighbor)) {
                    dfs(neighbor);
                }
            });
        }

        graph.nodes.forEach(node => {
            if (!visited.has(node)) {
                dfs(node);
                components++;
            }
        });
        return components;
    }

    function calculateCentrality(graph) {
        // Simple degree centrality: number of direct connections
        const centralityScores = {};
        graph.nodes.forEach(node => {
            centralityScores[node] = graph.adj.get(node).size;
        });

        // Sort by centrality score (descending)
        const sortedCentrality = Object.entries(centralityScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .slice(0, 5); // Top 5

        return sortedCentrality;
    }

    function calculateAncestorsDescendants(graph, individuals) {
        const ancestorCounts = {};
        const descendantCounts = {};

        // Helper function for BFS traversal
        function bfs(startNode, adjacencyList) {
            const visited = new Set();
            const queue = [startNode];
            visited.add(startNode);
            let count = 0;

            while (queue.length > 0) {
                const node = queue.shift();
                if (individuals[node] && node !== startNode) { // Only count individuals, not families, and not the start node itself
                    count++;
                }

                adjacencyList.get(node).forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                });
            }
            return count;
        }

        graph.nodes.forEach(node => {
            if (individuals[node]) { // Only calculate for individuals
                ancestorCounts[node] = bfs(node, graph.reverseAdj);
                descendantCounts[node] = bfs(node, graph.adj);
            }
        });

        // Sort and get top 5 for ancestors
        const mostAncestors = Object.entries(ancestorCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([id, score]) => ({ id, score }));

        // Sort and get top 5 for descendants
        const mostDescendants = Object.entries(descendantCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([id, score]) => ({ id, score }));

        return { mostAncestors, mostDescendants, allAncestorCounts: ancestorCounts, allDescendantCounts: descendantCounts };
    }

    function calculateDiameter(graph) {
        let maxDistance = 0;
        const nodes = graph.nodes;

        if (nodes.length === 0) return 0;

        // For each node, run BFS to find shortest paths to all other nodes
        for (let i = 0; i < nodes.length; i++) {
            const startNode = nodes[i];
            const distances = new Map();
            const queue = [{ node: startNode, dist: 0 }];
            distances.set(startNode, 0);

            let head = 0;
            while (head < queue.length) {
                const { node, dist } = queue[head++];

                maxDistance = Math.max(maxDistance, dist);

                graph.adj.get(node).forEach(neighbor => {
                    if (!distances.has(neighbor)) {
                        distances.set(neighbor, dist + 1);
                        queue.push({ node: neighbor, dist: dist + 1 });
                    }
                });
            }
        }
        return maxDistance;
    }

    function calculateLongestPath(graph) {
        console.log('calculateLongestPath: Starting. Graph nodes count:', graph.nodes.length);
        let maxPathLength = 0;
        const nodes = graph.nodes;

        // Function to perform DFS and find longest path from a starting node
        function dfsFindLongestPath(startNode, currentPathLength, visitedNodes, currentAdj) {
            console.log('Longest Path DFS: Visiting node', startNode, 'Current path length:', currentPathLength);
            maxPathLength = Math.max(maxPathLength, currentPathLength);

            currentAdj.get(startNode).forEach(neighbor => {
                if (!visitedNodes.has(neighbor)) {
                    visitedNodes.add(neighbor);
                    dfsFindLongestPath(neighbor, currentPathLength + 1, visitedNodes, currentAdj);
                    visitedNodes.delete(neighbor); // Backtrack
                }
            });
        }

        nodes.forEach(node => {
            // Find longest path in descent (parent to child)
            console.log('Longest Path: Starting DFS for descent from', node);
            dfsFindLongestPath(node, 0, new Set([node]), graph.adj);
            // Find longest path in ascent (child to parent)
            console.log('Longest Path: Starting DFS for ascent from', node);
            dfsFindLongestPath(node, 0, new Set([node]), graph.reverseAdj);
        });
        console.log('calculateLongestPath: Finished. Max path length found:', maxPathLength);
        return maxPathLength;
    }

    function calculateAverageDistance(graph) {
        console.log('calculateAverageDistance: Starting. Graph nodes count:', graph.nodes.length);
        let totalDistance = 0;
        let numPairs = 0;
        const nodes = graph.nodes;

        if (nodes.length === 0) {
            console.log('calculateAverageDistance: No nodes, average distance is 0.');
            return 0;
        }

        for (let i = 0; i < nodes.length; i++) {
            const startNode = nodes[i];
            const distances = new Map();
            const queue = [{ node: startNode, dist: 0 }];
            distances.set(startNode, 0);

            let head = 0;
            while (head < queue.length) {
                const { node, dist } = queue[head++];

                if (node !== startNode) {
                    totalDistance += dist;
                    numPairs++;
                }

                graph.adj.get(node).forEach(neighbor => {
                    if (!distances.has(neighbor)) {
                        distances.set(neighbor, dist + 1);
                        queue.push({ node: neighbor, dist: dist + 1 });
                    }
                });
            }
        }

        const average = numPairs > 0 ? totalDistance / numPairs : 0;
        console.log('calculateAverageDistance: Finished. Total distance:', totalDistance, 'Num pairs:', numPairs, 'Average:', average);
        return average;
    }


    function displayReport(report) {
        const individuals = report.individuals; // Get individuals data from report
        let html = `
            <div class="report-section-content">
                <h3>Summary</h3>
                <p><strong>Total Individuals Processed:</strong> ${report.totalIndividuals}</p>

                <h3>Graph Theory Statistics</h3>
                <p>
                    <strong>Connectivity (Number of separate family trees):</strong>
                    <span class="tooltip">${report.connectivity}
                        <span class="tooltiptext">The number of disconnected components in the family tree graph. Each component represents a separate family tree.</span>
                    </span>
                </p>
                <p>
                    <strong>Diameter (Longest shortest path):</strong>
                    <span class="tooltip">${report.diameter}
                        <span class="tooltiptext">The greatest distance (number of relationships) between any two individuals in the largest connected component of the family tree.</span>
                    </span>
                </p>
                <p>
                    <strong>Longest Path (Approximation):</strong>
                    <span class="tooltip">${report.longestPath}
                        <span class="tooltiptext">The maximum number of unique relationships in a single, non-repeating chain of individuals within the family tree. This is an approximation for general graphs.</span>
                    </span>
                </p>
                <p>
                    <strong>Average Distance:</strong>
                    <span class="tooltip">${report.averageDistance.toFixed(2)}
                        <span class="tooltiptext">The average shortest path length between all pairs of reachable individuals in the family tree.</span>
                    </span>
                </p>

                <h4>Top 5 Most Central Individuals (by Degree Centrality)</h4>
                <p class="tooltip">Degree Centrality:
                    <span class="tooltiptext">Measures the number of direct connections an individual has. Higher degree centrality means more direct relationships.</span>
                </p>
                <ul>
            `;
            if (report.centrality.length > 0) {
                report.centrality.forEach(([id, score]) => {
                    html += `<li><strong>${individuals[id] ? individuals[id].name : 'Unknown'}</strong> (ID: ${id}, Connections: ${score})</li>`;
                });
            } else {
                html += `<li>No central individuals found.</li>`;
            }
            html += `</ul>`;

            html += `
                <h4>Top 5 Individuals with Most Ancestors</h4>
                <p class="tooltip">Most Ancestors:
                    <span class="tooltiptext">Individuals who are connected to the largest number of preceding generations within the family tree.</span>
                </p>
                <ul>
            `;
            if (report.mostAncestors.length > 0) {
                report.mostAncestors.forEach(item => {
                    html += `<li><strong>${individuals[item.id] ? individuals[item.id].name : 'Unknown'}</strong> (ID: ${item.id}, Ancestors: ${item.score})</li>`;
                });
            } else {
                html += `<li>No individuals with ancestors found.</li>`;
            }
            html += `</ul>`;

            html += `
                <h4>Top 5 Individuals with Most Descendants</h4>
                <p class="tooltip">Most Descendants:
                    <span class="tooltiptext">Individuals who are connected to the largest number of succeeding generations within the family tree.</span>
                </p>
                <ul>
            `;
            if (report.mostDescendants.length > 0) {
                report.mostDescendants.forEach(item => {
                    html += `<li><strong>${individuals[item.id] ? individuals[item.id].name : 'Unknown'}</strong> (ID: ${item.id}, Descendants: ${item.score})</li>`;
                });
            } else {
                html += `<li>No individuals with descendants found.</li>`;
            }
            html += `</ul>`;

            html += `
                </div>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }