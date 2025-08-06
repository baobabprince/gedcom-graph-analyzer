document.addEventListener('DOMContentLoaded', () => {
    const gedcomFile = document.getElementById('gedcomFile');
    const loadSampleButton = document.getElementById('loadSampleButton');
    const resultsDiv = document.getElementById('results');
    const debugLogElement = document.getElementById('debugLog');

    // Redirect console.log to the debug output element
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight; // Auto-scroll to bottom
    };

    // Redirect console.warn and console.error as well
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        originalConsoleWarn.apply(console, args);
        const message = 'WARN: ' + args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight;
    };

    const originalConsoleError = console.error;
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        const message = 'ERROR: ' + args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight;
    };
    const debugLogElement = document.getElementById('debugLog');

    // Redirect console.log to the debug output element
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight; // Auto-scroll to bottom
    };

    // Redirect console.warn and console.error as well
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        originalConsoleWarn.apply(console, args);
        const message = 'WARN: ' + args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight;
    };

    const originalConsoleError = console.error;
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        const message = 'ERROR: ' + args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            } else {
                return String(arg);
            }
        }).join(' ');
        debugLogElement.textContent += message + '\n';
        debugLogElement.scrollTop = debugLogElement.scrollHeight;
    };

    gedcomFile.addEventListener('change', () => {
        const file = gedcomFile.files[0];
        if (!file) {
            resultsDiv.innerHTML = '<p style="color: red;">Please select a GEDCOM file.</p>';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const gedcomContent = e.target.result;
            try {
                const report = analyzeGedcom(gedcomContent);
                displayReport(report);
            } catch (error) {
                resultsDiv.innerHTML = `<p style="color: red;">Error processing GEDCOM file: ${error.message}</p>`;
                console.error("GEDCOM processing error:", error);
            }
        };
        reader.onerror = () => {
            resultsDiv.innerHTML = '<p style="color: red;">Error reading file.</p>';
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
1 NAME George V /Windsor/
1 SEX M
1 BIRT
2 DATE 03 JUN 1865
1 DEAT
2 DATE 20 JAN 1936
1 FAMS @F1@

0 @I2@ INDI
1 NAME Mary /Teck/
1 SEX F
1 BIRT
2 DATE 26 MAY 1867
1 DEAT
2 DATE 24 MAR 1953
1 FAMS @F1@

0 @I3@ INDI
1 NAME Edward VIII /Windsor/
1 SEX M
1 BIRT
2 DATE 23 JUN 1894
1 DEAT
2 DATE 28 MAY 1972
1 FAMC @F1@

0 @I4@ INDI
1 NAME George VI /Windsor/
1 SEX M
1 BIRT
2 DATE 14 DEC 1895
1 DEAT
2 DATE 06 FEB 1952
1 FAMC @F1@
1 FAMS @F2@

0 @I5@ INDI
1 NAME Elizabeth /Bowes-Lyon/
1 SEX F
1 BIRT
2 DATE 04 AUG 1900
1 DEAT
2 DATE 30 MAR 2002
1 FAMS @F2@

0 @I6@ INDI
1 NAME Elizabeth II /Windsor/
1 SEX F
1 BIRT
2 DATE 21 APR 1926
1 FAMS @F3@
1 FAMC @F2@

0 @I7@ INDI
1 NAME Philip /Mountbatten/
1 SEX M
1 BIRT
2 DATE 10 JUN 1921
1 DEAT
2 DATE 09 APR 2021
1 FAMS @F3@

0 @I8@ INDI
1 NAME Charles /Windsor/
1 SEX M
1 BIRT
2 DATE 14 NOV 1948
1 FAMC @F3@
1 FAMS @F4@

0 @I9@ INDI
1 NAME Diana /Spencer/
1 SEX F
1 BIRT
2 DATE 01 JUL 1961
1 DEAT
2 DATE 31 AUG 1997
1 FAMS @F4@

0 @I10@ INDI
1 NAME William /Windsor/
1 SEX M
1 BIRT
2 DATE 21 JUN 1982
1 FAMC @F4@
1 FAMS @F5@

0 @I11@ INDI
1 NAME Catherine /Middleton/
1 SEX F
1 BIRT
2 DATE 09 JAN 1982
1 FAMS @F5@

0 @I12@ INDI
1 NAME George /Windsor/
1 SEX M
1 BIRT
2 DATE 22 JUL 2013
1 FAMC @F5@

0 @I13@ INDI
1 NAME Charlotte /Windsor/
1 SEX F
1 BIRT
2 DATE 02 MAY 2015
1 FAMC @F5@

0 @I14@ INDI
1 NAME Louis /Windsor/
1 SEX M
1 BIRT
2 DATE 23 APR 2018
1 FAMC @F5@

0 @I15@ INDI
1 NAME Harry /Windsor/
1 SEX M
1 BIRT
2 DATE 15 SEP 1984
1 FAMC @F4@
1 FAMS @F6@

0 @I16@ INDI
1 NAME Meghan /Markle/
1 SEX F
1 BIRT
2 DATE 04 AUG 1981
1 FAMS @F6@

0 @I17@ INDI
1 NAME Archie /Mountbatten-Windsor/
1 SEX M
1 BIRT
2 DATE 06 MAY 2019
1 FAMC @F6@

0 @I18@ INDI
1 NAME Lilibet /Mountbatten-Windsor/
1 SEX F
1 BIRT
2 DATE 04 JUN 2021
1 FAMC @F6@

0 @I19@ INDI
1 NAME Anne /Windsor/
1 SEX F
1 BIRT
2 DATE 15 AUG 1950
1 FAMC @F3@

0 @I20@ INDI
1 NAME Andrew /Windsor/
1 SEX M
1 BIRT
2 DATE 19 FEB 1960
1 FAMC @F3@

0 @I21@ INDI
1 NAME Edward /Windsor/
1 SEX M
1 BIRT
2 DATE 10 MAR 1964
1 FAMC @F3@

0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
1 CHIL @I4@

0 @F2@ FAM
1 HUSB @I4@
1 WIFE @I5@
1 CHIL @I6@

0 @F3@ FAM
1 HUSB @I7@
1 WIFE @I6@
1 CHIL @I8@
1 CHIL @I19@
1 CHIL @I20@
1 CHIL @I21@

0 @F4@ FAM
1 HUSB @I8@
1 WIFE @I9@
1 CHIL @I10@
1 CHIL @I15@

0 @F5@ FAM
1 HUSB @I10@
1 WIFE @I11@
1 CHIL @I12@
1 CHIL @I13@
1 CHIL @I14@

0 @F6@ FAM
1 HUSB @I15@
1 WIFE @I16@
1 CHIL @I17@
1 CHIL @I18@
`;

    loadSampleButton.addEventListener('click', () => {
        try {
            const report = analyzeGedcom(sampleGedcomData);
            displayReport(report);
        } catch (error) {
            resultsDiv.innerHTML = `<p style="color: red;">Error processing sample GEDCOM data: ${error.message}</p>`;
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
            } else if (currentRecordType === 'INDI' && currentRecord) {
                if (tag === 'NAME') {
                    individuals[currentRecord].name = value;
                } else if (tag === 'SEX') {
                    individuals[currentRecord].sex = value;
                } else if (tag === 'FAMS') { // Family as Spouse
                    individuals[currentRecord].families.spouse.push(value);
                } else if (tag === 'FAMC') { // Family as Child
                    individuals[currentRecord].families.child.push(value);
                }
            } else if (currentRecordType === 'FAM' && currentRecord) {
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
        const { mostAncestors, mostDescendants } = calculateAncestorsDescendants(graph, individuals);
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
        console.log('calculateConnectivity: Graph nodes:', graph.nodes.length);
        console.log('calculateConnectivity: Graph adjacency list:', graph.adj);
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

        return { mostAncestors, mostDescendants };
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
        let maxPathLength = 0;
        const nodes = graph.nodes;

        // Function to perform DFS and find longest path from a starting node
        function dfsFindLongestPath(startNode, currentPathLength, visitedNodes, currentAdj) {
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
            dfsFindLongestPath(node, 0, new Set([node]), graph.adj);
            // Find longest path in ascent (child to parent)
            dfsFindLongestPath(node, 0, new Set([node]), graph.reverseAdj);
        });

        return maxPathLength;
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
                <h3>Individual Ancestor/Descendant Counts</h3>
                <div class="individual-counts-grid">
            `;

            // Sort individuals by name for pleasing output
            const sortedIndividuals = Object.values(individuals).sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });

            sortedIndividuals.forEach(person => {
                html += `
                    <div class="individual-card">
                        <strong>${person.name}</strong> (ID: ${person.id})<br>
                        Ancestors: ${person.ancestorCount}<br>
                        Descendants: ${person.descendantCount}
                    </div>
                `;
            });

            html += `
                </div>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }
});