document.addEventListener('DOMContentLoaded', () => {
    const gedcomFile = document.getElementById('gedcomFile');
    const loadSampleButton = document.getElementById('loadSampleButton');
    const resultsDiv = document.getElementById('results');
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');
    const debugLogElement = document.getElementById('debugLog');

    // Clear debug log on page load
    if (debugLogElement) {
        debugLogElement.textContent = '';
    }

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
        if (debugLogElement) {
            debugLogElement.textContent += message + '\n';
            debugLogElement.scrollTop = debugLogElement.scrollHeight; // Auto-scroll to bottom
        }
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
        if (debugLogElement) {
            debugLogElement.textContent += message + '\n';
            debugLogElement.scrollTop = debugLogElement.scrollHeight;
        }
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
        if (debugLogElement) {
            debugLogElement.textContent += message + '\n';
            debugLogElement.scrollTop = debugLogElement.scrollHeight;
        }
    };

    gedcomFile.addEventListener('change', () => {
        resultsDiv.innerHTML = ''; // Clear previous results
        progressBar.value = 0;
        statusMessage.textContent = 'Starting analysis...';

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
                statusMessage.textContent = `Processing: ${percent.toFixed(2)}%`;
            }
        };

        reader.onload = (e) => {
            statusMessage.textContent = 'File processed. Analyzing...';
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
1 NAME Elizabeth II
1 SEX F
1 BIRT
2 DATE 21 APR 1926
1 FAMS @F1@
0 @I2@ INDI
1 NAME Philip Mountbatten
1 SEX M
1 BIRT
2 DATE 10 JUN 1921
1 DEAT
2 DATE 09 APR 2021
1 FAMS @F1@
0 @I3@ INDI
1 NAME Charles
1 SEX M
1 BIRT
2 DATE 14 NOV 1948
1 FAMC @F1@
1 FAMS @F2@
0 @I4@ INDI
1 NAME Diana Spencer
1 SEX F
1 BIRT
2 DATE 01 JUL 1961
1 DEAT
2 DATE 31 AUG 1997
1 FAMS @F2@
0 @I5@ INDI
1 NAME William
1 SEX M
1 BIRT
2 DATE 21 JUN 1982
1 FAMC @F2@
0 @I6@ INDI
1 NAME Harry
1 SEX M
1 BIRT
2 DATE 15 SEP 1984
1 FAMC @F2@
0 @F1@ FAM
1 HUSB @I2@
1 WIFE @I1@
1 CHIL @I3@
0 @F2@ FAM
1 HUSB @I3@
1 WIFE @I4@
1 CHIL @I5@
1 CHIL @I6@
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
        const averageDistance = calculateAverageDistance(graph);
        const maxGenerationalDepth = calculateMaxGenerationalDepth(individuals, families);

        // New statistics
        const totalFamilies = Object.keys(families).length;

        const genderCounts = { M: 0, F: 0, U: 0 };
        for (const id in individuals) {
            const sex = individuals[id].sex || 'U';
            if (genderCounts[sex] !== undefined) {
                genderCounts[sex]++;
            } else {
                genderCounts['U']++;
            }
        }

        let totalChildren = 0;
        for (const famId in families) {
            totalChildren += families[famId].children.length;
        }
        const avgChildrenPerFamily = totalFamilies > 0 ? totalChildren / totalFamilies : 0;

        let rootIndividualsCount = 0;
        for (const id in individuals) {
            if (!individuals[id].families.child || individuals[id].families.child.length === 0) {
                rootIndividualsCount++;
            }
        }

        let leafIndividualsCount = 0;
        const descendantCounts = allDescendantCounts; // from calculateAncestorsDescendants
        for (const id in individuals) {
            if (descendantCounts[id] === 0) {
                leafIndividualsCount++;
            }
        }

        return {
            totalIndividuals: Object.keys(individuals).length,
            connectivity,
            centrality,
            mostAncestors,
            mostDescendants,
            diameter,
            averageDistance,
            individuals,
            families,
            // New stats
            totalFamilies,
            genderCounts,
            avgChildrenPerFamily,
            rootIndividualsCount,
            leafIndividualsCount,
            maxGenerationalDepth
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

    function calculateMaxGenerationalDepth(individuals, families) {
        const parentToChildAdj = new Map();
        const nodes = Object.keys(individuals);
        nodes.forEach(id => parentToChildAdj.set(id, []));

        for (const famId in families) {
            const family = families[famId];
            const parents = [];
            if (family.husband && individuals[family.husband]) parents.push(family.husband);
            if (family.wife && individuals[family.wife]) parents.push(family.wife);

            for (const childId of family.children) {
                if (!individuals[childId]) continue;
                for (const parentId of parents) {
                    parentToChildAdj.get(parentId).push(childId);
                }
            }
        }

        const memo = new Map();

        function dfs(nodeId, visited) {
            if (visited.has(nodeId)) { // Cycle detected
                return 0;
            }
            if (memo.has(nodeId)) {
                return memo.get(nodeId);
            }

            visited.add(nodeId);

            const children = parentToChildAdj.get(nodeId) || [];
            let maxDepth = 0;
            for (const childId of children) {
                maxDepth = Math.max(maxDepth, 1 + dfs(childId, visited));
            }

            visited.delete(nodeId); // Backtrack
            memo.set(nodeId, maxDepth);
            return maxDepth;
        }

        let overallMaxDepth = 0;
        nodes.forEach(nodeId => {
            overallMaxDepth = Math.max(overallMaxDepth, dfs(nodeId, new Set()));
        });

        return overallMaxDepth;
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
                <p><strong>Total Families Processed:</strong> ${report.totalFamilies}</p>

                <h3>General Statistics</h3>
                <p><strong>Gender Distribution:</strong> Male: ${report.genderCounts.M}, Female: ${report.genderCounts.F}, Unknown: ${report.genderCounts.U}</p>
                <p><strong>Average Children per Family:</strong> ${report.avgChildrenPerFamily.toFixed(2)}</p>
                <p><strong>Individuals with No Known Parents (Roots):</strong> ${report.rootIndividualsCount}</p>
                <p><strong>Individuals with No Children (Leaves):</strong> ${report.leafIndividualsCount}</p>

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
                    <strong>Maximum Generational Depth:</strong>
                    <span class="tooltip">${report.maxGenerationalDepth}
                        <span class="tooltiptext">The longest chain of parent-child relationships found in the tree.</span>
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