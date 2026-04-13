        // ==================== DATA ====================
        let orders = [
            { id: "CC-1001", customer: "Maria Santos", items: "T-Shirt x2", date: "2026-03-25", total: "₱900", status: "pending", type: "delivery", address: "123 Rizal St., Santa Rosa, Laguna", note: "" },
            { id: "CC-1002", customer: "Mark Lim", items: "Hoodie x1", date: "2026-03-25", total: "₱1,200", status: "processing", type: "pickup", address: "456 Mabini Ave., Calamba, Laguna", note: "" },
            { id: "CC-1003", customer: "Sofia Cruz", items: "Baby Onesie x3", date: "2026-03-24", total: "₱750", status: "ready", type: "pickup", address: "789 Bonifacio Rd., Biñan, Laguna", note: "3rd floor" },
            { id: "CC-1004", customer: "Ana Reyes", items: "Floral Dress x1", date: "2026-03-24", total: "₱900", status: "delivered", type: "delivery", address: "22 Luna St., Sta. Rosa, Laguna", note: "" },
            { id: "CC-1005", customer: "Carlo Bautista", items: "Kids Polo x2", date: "2026-03-23", total: "₱700", status: "pending", type: "delivery", address: "5 Magsaysay St., San Pedro, Laguna", note: "" },
        ];

        let products = [
            { name: "Custom T-Shirt", category: "Men", price: 450, stock: 30 },
            { name: "Floral Dress", category: "Women", price: 900, stock: 5 },
            { name: "Kids Polo", category: "Kids", price: 350, stock: 0 },
            { name: "Baby Onesie", category: "Babies", price: 250, stock: 20 },
            { name: "Hoodie", category: "Men", price: 1200, stock: 12 },
        ];

        let currentOrderFilter = "all";
        let currentDeliveryFilter = "all";
        let editStatusIndex = null;
        let editStockIndex = null;

        // ==================== NAVIGATION ====================
        const showSection = (name) => {
            document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
            document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

            document.getElementById("sec-" + name).classList.add("active");

            document.querySelectorAll(".nav-item").forEach(n => {
                if (n.getAttribute("onclick").includes(name)) {
                    n.classList.add("active");
                }
            });

            const titles = {
                orders: "View Orders",
                update: "Update Order Status",
                search: "Search Orders",
                stock: "Product Stock",
                stockupdate: "Update Stock",
                deliveries: "Deliveries & Pickups"
            };
            document.getElementById("topbarTitle").textContent = titles[name];

            if (name === "orders") renderAllOrders();
            if (name === "update") renderUpdateOrders();
            if (name === "search") renderSearch();
            if (name === "stock") renderStockView();
            if (name === "stockupdate") renderStockUpdate();
            if (name === "deliveries") renderDeliveries();
        };

        // ==================== MODAL HELPERS ====================
        const openModal = (id) => {
            document.getElementById(id).style.display = "flex";
        };

        const closeModal = (id) => {
            document.getElementById(id).style.display = "none";
        };

        document.querySelectorAll(".modalOverlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.style.display = "none";
            });
        });

        // ==================== BADGE HELPER ====================
        const getBadge = (status) => {
            const map = {
                pending: "badge-yellow",
                processing: "badge-blue",
                ready: "badge-green",
                delivered: "badge-gray"
            };
            return `<span class="badge ${map[status] || 'badge-gray'}">${capitalize(status)}</span>`;
        };

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

        // ==================== VIEW ALL ORDERS ====================
        const renderAllOrders = () => {
            const body = document.getElementById("allOrdersBody");
            body.innerHTML = "";

            orders.forEach(o => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${o.id}</td>
                    <td><strong>${o.customer}</strong></td>
                    <td>${o.items}</td>
                    <td style="color:#888;">${o.date}</td>
                    <td>${o.total}</td>
                    <td><span class="badge badge-blue">${capitalize(o.type)}</span></td>
                    <td>${getBadge(o.status)}</td>`;
                body.appendChild(row);
            });

            document.getElementById("o-total").textContent = orders.length;
            document.getElementById("o-pending").textContent = orders.filter(o => o.status === "pending").length;
            document.getElementById("o-processing").textContent = orders.filter(o => o.status === "processing").length;
            document.getElementById("o-done").textContent = orders.filter(o => o.status === "ready" || o.status === "delivered").length;
        };

        // ==================== UPDATE ORDER STATUS ====================
        const setOrderFilter = (filter, btn) => {
            currentOrderFilter = filter;
            document.querySelectorAll("#sec-update .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderUpdateOrders();
        };

        const renderUpdateOrders = () => {
            const body = document.getElementById("updateOrdersBody");
            const noOrders = document.getElementById("noUpdateOrders");
            body.innerHTML = "";

            const filtered = orders.filter(o =>
                currentOrderFilter === "all" || o.status === currentOrderFilter
            );

            if (filtered.length === 0) {
                noOrders.style.display = "block";
            } else {
                noOrders.style.display = "none";
                filtered.forEach(o => {
                    const i = orders.indexOf(o);
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${o.id}</td>
                        <td><strong>${o.customer}</strong></td>
                        <td>${o.items}</td>
                        <td>${getBadge(o.status)}</td>
                        <td><button class="btn-dark" onclick="openStatusModal(${i})">Update</button></td>`;
                    body.appendChild(row);
                });
            }
        };

        const openStatusModal = (index) => {
            editStatusIndex = index;
            const o = orders[index];
            document.getElementById("statusModalSub").textContent = o.id + " — " + o.customer;
            document.getElementById("newStatus").value = o.status;
            document.getElementById("statusNote").value = o.note;
            openModal("statusModalOverlay");
        };

        const saveStatus = () => {
            orders[editStatusIndex].status = document.getElementById("newStatus").value;
            orders[editStatusIndex].note = document.getElementById("statusNote").value;
            closeModal("statusModalOverlay");
            renderUpdateOrders();
        };

        // ==================== SEARCH ORDERS ====================
        const renderSearch = () => {
            const search = document.getElementById("orderSearch").value.toLowerCase().trim();
            const body = document.getElementById("searchOrdersBody");
            const noData = document.getElementById("noSearchOrders");
            body.innerHTML = "";

            if (!search) {
                noData.style.display = "block";
                noData.textContent = "Start typing to search orders.";
                return;
            }

            const filtered = orders.filter(o =>
                o.id.toLowerCase().includes(search) ||
                o.customer.toLowerCase().includes(search)
            );

            if (filtered.length === 0) {
                noData.style.display = "block";
                noData.textContent = "No orders found.";
            } else {
                noData.style.display = "none";
                filtered.forEach(o => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${o.id}</td>
                        <td><strong>${o.customer}</strong></td>
                        <td>${o.items}</td>
                        <td style="color:#888;">${o.date}</td>
                        <td>${o.total}</td>
                        <td>${getBadge(o.status)}</td>`;
                    body.appendChild(row);
                });
            }
        };

        // ==================== VIEW STOCK ====================
        const renderStockView = () => {
            const body = document.getElementById("stockViewBody");
            body.innerHTML = "";

            products.forEach(p => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 10;
                const label = isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock";
                const badge = isOut ? "badge-red" : isLow ? "badge-yellow" : "badge-green";

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><strong>${p.name}</strong></td>
                    <td>${p.category}</td>
                    <td style="font-size:18px;font-weight:900;">${p.stock}</td>
                    <td><span class="badge ${badge}">${label}</span></td>`;
                body.appendChild(row);
            });
        };

        // ==================== UPDATE STOCK ====================
        const renderStockUpdate = () => {
            const body = document.getElementById("stockUpdateBody");
            body.innerHTML = "";

            products.forEach((p, i) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 10;
                const badge = isOut ? "badge-red" : isLow ? "badge-yellow" : "badge-green";

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><strong>${p.name}</strong></td>
                    <td>${p.category}</td>
                    <td>
                        <span class="badge ${badge}" style="font-size:14px;padding:4px 12px;">${p.stock}</span>
                    </td>
                    <td><button class="btn-dark" onclick="openEmpStockModal(${i})">Adjust</button></td>`;
                body.appendChild(row);
            });
        };

        const openEmpStockModal = (index) => {
            editStockIndex = index;
            document.getElementById("empStockSub").textContent = products[index].name + " — Current: " + products[index].stock;
            document.getElementById("empStockAmount").value = "";
            openModal("empStockModalOverlay");
        };

        const saveEmpStock = () => {
            const action = document.getElementById("stockAction").value;
            const amount = Number(document.getElementById("empStockAmount").value);

            if (!amount || amount < 0) {
                alert("Please enter a valid amount.");
                return;
            }

            if (action === "add") {
                products[editStockIndex].stock += amount;
            } else if (action === "remove") {
                products[editStockIndex].stock = Math.max(0, products[editStockIndex].stock - amount);
            } else if (action === "set") {
                products[editStockIndex].stock = amount;
            }

            closeModal("empStockModalOverlay");
            renderStockUpdate();
        };

        // ==================== DELIVERIES ====================
        const setDeliveryFilter = (filter, btn) => {
            currentDeliveryFilter = filter;
            document.querySelectorAll("#sec-deliveries .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderDeliveries();
        };

        const renderDeliveries = () => {
            const grid = document.getElementById("deliveryGrid");
            const noData = document.getElementById("noDeliveries");
            grid.innerHTML = "";

            const filtered = orders.filter(o => {
                const notDone = o.status !== "delivered";
                const typeMatch = currentDeliveryFilter === "all" || o.type === currentDeliveryFilter;
                return notDone && typeMatch;
            });

            if (filtered.length === 0) {
                noData.style.display = "block";
            } else {
                noData.style.display = "none";
                filtered.forEach(o => {
                    const i = orders.indexOf(o);
                    const card = document.createElement("div");
                    card.className = "delivery-card";
                    card.innerHTML = `
                        <div class="d-id">${o.id} · <span class="badge badge-blue">${capitalize(o.type)}</span></div>
                        <div class="d-name">${o.customer}</div>
                        <div class="d-address">📍 ${o.address}${o.note ? "<br>📝 " + o.note : ""}</div>
                        <div style="margin-bottom:12px;">${getBadge(o.status)} · ${o.items}</div>
                        <div class="d-actions">
                            <button class="btn-green" onclick="markDelivered(${i})">✓ Mark Delivered</button>
                            <button class="btn-dark" onclick="openStatusModal(${i})">Update</button>
                        </div>`;
                    grid.appendChild(card);
                });
            }
        };

        const markDelivered = (index) => {
            orders[index].status = "delivered";
            renderDeliveries();
        };

        // ==================== INIT ====================
        renderAllOrders();