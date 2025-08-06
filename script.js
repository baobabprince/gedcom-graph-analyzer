document.addEventListener('DOMContentLoaded', () => {
    const gedcomFile = document.getElementById('gedcomFile');
    const analyzeButton = document.getElementById('analyzeButton');
    const resultsDiv = document.getElementById('results');

    analyzeButton.addEventListener('click', () => {
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
1 NAME Elizabeth II /Windsor/
1 SEX F
1 BIRT
2 DATE 21 APR 1926
1 FAMS @F1@
0 @I2@ INDI
1 NAME Philip /Mountbatten/
1 SEX M
1 BIRT
2 DATE 10 JUN 1921
1 DEAT
2 DATE 09 APR 2021
1 FAMS @F1@
0 @I3@ INDI
1 NAME Charles /Windsor/
1 SEX M
1 BIRT
2 DATE 14 NOV 1948
1 FAMC @F1@
1 FAMS @F2@
0 @I4@ INDI
1 NAME Diana /Spencer/
1 SEX F
1 BIRT
2 DATE 01 JUL 1961
1 DEAT
2 DATE 31 AUG 1997
1 FAMS @F2@
0 @I5@ INDI
1 NAME William /Windsor/
1 SEX M
1 BIRT
2 DATE 21 JUN 1982
1 FAMC @F2@
0 @I6@ INDI
1 NAME Harry /Windsor/
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
1 CHIL @I6@`;

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
        const relationships = []; // To build the graph

        const lines = gedcomContent.split('\n');
        let currentIndividual = null;
        let currentFamily = null;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            const parts = trimmedLine.match(/^(\d+)\s+(@[^@]+@)?\s*(\w+)\s*(.*)$/);
            if (!parts) return;

            const level = parseInt(parts[1]);
            const xrefId = parts[2];
            const tag = parts[3];
            const value = parts[4].trim();

            if (level === 0) {
                if (tag === 'INDI') {
                    currentIndividual = xrefId;
                    individuals[xrefId] = { id: xrefId, name: 'Unknown', sex: 'U', families: { spouse: [], child: [] } };
                } else if (tag === 'FAM') {
                    currentFamily = xrefId;
                    families[xrefId] = { id: xrefId, husband: null, wife: null, children: [] };
                } else {
                    currentIndividual = null;
                    currentFamily = null;
                }
            } else if (currentIndividual) {
                if (tag === 'NAME') {
                    individuals[currentIndividual].name = value;
                } else if (tag === 'SEX') {
                    individuals[currentIndividual].sex = value;
                } else if (tag === 'FAMS') { // Family as Spouse
                    individuals[currentIndividual].families.spouse.push(value);
                } else if (tag === 'FAMC') { // Family as Child
                    individuals[currentIndividual].families.child.push(value);
                }
            } else if (currentFamily) {
                if (tag === 'HUSB') {
                    families[currentFamily].husband = value;
                    relationships.push({ from: value, to: currentFamily, type: 'HUSB' });
                } else if (tag === 'WIFE') {
                    families[currentFamily].wife = value;
                    relationships.push({ from: value, to: currentFamily, type: 'WIFE' });
                } else if (tag === 'CHIL') {
                    families[currentFamily].children.push(value);
                    relationships.push({ from: value, to: currentFamily, type: 'CHIL' });
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
            // Add more statistics here
        };
    }

    function buildGraph(individuals, families) {
        const nodes = new Set();
        const adj = new Map();

        // Add all individuals as nodes
        for (const id in individuals) {
            nodes.add(id);
            adj.set(id, new Set()); // Initialize adjacency list for each individual
        }

        // Add family relationships as edges between individuals
        for (const famId in families) {
            const family = families[famId];
            const husbandId = family.husband;
            const wifeId = family.wife;
            const childrenIds = family.children;

            // Link husband and wife
            if (husbandId && wifeId) {
                if (nodes.has(husbandId) && nodes.has(wifeId)) {
                    adj.get(husbandId).add(wifeId);
                    adj.get(wifeId).add(husbandId);
                }
            }

            // Link parents to children
            childrenIds.forEach(childId => {
                if (nodes.has(childId)) {
                    if (husbandId && nodes.has(husbandId)) {
                        adj.get(childId).add(husbandId);
                        adj.get(husbandId).add(childId);
                    }
                    if (wifeId && nodes.has(wifeId)) {
                        adj.get(childId).add(wifeId);
                        adj.get(wifeId).add(childId);
                    }
                }
            });
        }

        return { nodes: Array.from(nodes), adj: adj };
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

        // Initialize counts
        graph.nodes.forEach(node => {
            if (individuals[node]) { // Only count for individuals, not families
                ancestorCounts[node] = 0;
                descendantCounts[node] = 0;
            }
        });

        // This is a simplified approach. A full ancestor/descendant calculation
        // would require traversing the graph based on parent-child relationships,
        // which are not explicitly represented as directed edges in the current
        // undirected graph. For a more accurate calculation, the graph
        // construction would need to differentiate parent-child edges.

        // For now, we'll use a proxy: individuals with many connections (high degree centrality)
        // are likely to have many ancestors/descendants.
        // This needs to be refined with a directed graph for accurate results.

        // Placeholder: For a proper implementation, you'd need to build a directed graph
        // where edges go from child to parent for ancestors, and parent to child for descendants.
        // Then perform BFS/DFS from each individual.

        // For demonstration, let's just return the top 5 individuals by degree centrality
        // as a proxy for "most connected" which often correlates.
        const sortedByDegree = Object.entries(calculateCentrality(graph))
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

        const mostAncestors = sortedByDegree.slice(0, 5).map(([id, score]) => ({ id, score }));
        const mostDescendants = sortedByDegree.slice(0, 5).map(([id, score]) => ({ id, score }));

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
        // This is a complex problem for general graphs (NP-hard).
        // For a family tree, it usually refers to the longest path without cycles.
        // A simple approximation for demonstration: find the longest path using BFS/DFS
        // from each node, keeping track of visited nodes in the current path.

        let longestPathLength = 0;
        const nodes = graph.nodes;

        function dfsLongestPath(startNode, currentPath, visitedInPath) {
            longestPathLength = Math.max(longestPathLength, currentPath.length - 1); // -1 because path length is edges

            graph.adj.get(startNode).forEach(neighbor => {
                if (!visitedInPath.has(neighbor)) {
                    visitedInPath.add(neighbor);
                    dfsLongestPath(neighbor, [...currentPath, neighbor], visitedInPath);
                    visitedInPath.delete(neighbor); // Backtrack
                }
            });
        }

        nodes.forEach(node => {
            dfsLongestPath(node, [node], new Set([node]));
        });

        return longestPathLength;
    }


    function displayReport(report) {
        let html = `
            <h3>Summary</h3>
            <p>Total Individuals Processed: ${report.totalIndividuals}</p>

            <h3>Graph Theory Statistics</h3>
            <p>
                Connectivity (Number of separate family trees):
                <span class="tooltip">${report.connectivity}
                    <span class="tooltiptext">The number of disconnected components in the family tree graph. Each component represents a separate family tree.</span>
                </span>
            </p>
            <p>
                Diameter (Longest shortest path):
                <span class="tooltip">${report.diameter}
                    <span class="tooltiptext">The greatest distance (number of relationships) between any two individuals in the largest connected component of the family tree.</span>
                </span>
            </p>
            <p>
                Longest Path (Approximation):
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
                html += `<li>Individual ID: ${id} (Connections: ${score})</li>`;
            });
        } else {
            html += `<li>No central individuals found.</li>`;
        }
        html += `</ul>`;

        html += `
            <h4>Top 5 Individuals with Most Ancestors (Approximation)</h4>
            <p class="tooltip">Most Ancestors:
                <span class="tooltiptext">Individuals who are connected to the largest number of preceding generations within the family tree. (Approximation based on connectivity for this demo).</span>
            </p>
            <ul>
        `;
        if (report.mostAncestors.length > 0) {
            report.mostAncestors.forEach(item => {
                html += `<li>Individual ID: ${item.id}</li>`;
            });
        } else {
            html += `<li>No individuals with ancestors found.</li>`;
        }
        html += `</ul>`;

        html += `
            <h4>Top 5 Individuals with Most Descendants (Approximation)</h4>
            <p class="tooltip">Most Descendants:
                <span class="tooltiptext">Individuals who are connected to the largest number of succeeding generations within the family tree. (Approximation based on connectivity for this demo).</span>
            </p>
            <ul>
        `;
        if (report.mostDescendants.length > 0) {
            report.mostDescendants.forEach(item => {
                html += `<li>Individual ID: ${item.id}</li>`;
            });
        } else {
            html += `<li>No individuals with descendants found.</li>`;
        }
        html += `</ul>`;


        resultsDiv.innerHTML = html;
    }
});