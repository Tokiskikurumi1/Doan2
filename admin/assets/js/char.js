fetch("char.html")
  .then((response) => response.text())
  .then((html) => {
    document.querySelector(".char-container").innerHTML = html;

    const chartData = [
      { month: "T 1", value: 120 },
      { month: "T 2", value: 180 },
      { month: "T 3", value: 90 },
      { month: "T 4", value: 220 },
      { month: "T 5", value: 160 },
      { month: "T 6", value: 120 },
      { month: "T 7", value: 180 },
      { month: "T 8", value: 90 },
      { month: "T 9", value: 220 },
      { month: "T 10", value: 160 },
      { month: "T 11", value: 120 },
      { month: "T 12", value: 180 },
    ];

    const chart = document.getElementById("chart");
    const labelRow = document.getElementById("labelRow");

    chartData.forEach((item) => {
      const group = document.createElement("div");
      group.className = "bar-group";

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = item.value + "px";
      bar.textContent = item.value + " " + "tr";

      group.appendChild(bar);
      chart.appendChild(group);

      const label = document.createElement("div");
      label.className = "month";
      label.textContent = item.month;
      labelRow.appendChild(label);
    });
  })
  .catch((error) => console.error("Lỗi fetch:", error));
