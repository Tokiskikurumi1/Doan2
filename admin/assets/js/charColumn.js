fetch("charColumn.html")
  .then((response) => response.text())
  .then((html) => {
    document.querySelector(".chartColumn-container").innerHTML = html;
    const chartData = [
      { label: "Nghe", value: 120 },
      { label: "Đọc", value: 180 },
      { label: "Viết", value: 90 },
      { label: "Từ vựng", value: 220 },
      { label: "Ngữ pháp", value: 160 },
    ];

    const textColumn = document.getElementById("textColumn");
    const chartColumn = document.getElementById("chartColumn");

    chartData.forEach((item) => {
      const group = document.createElement("div");
      group.className = "column-bar-group";

      const bar = document.createElement("div");
      bar.className = "column-bar";
      bar.style.width = item.value + "px";
      bar.textContent = item.value + " " + "học viên";

      group.appendChild(bar);
      chartColumn.appendChild(group);

      const label = document.createElement("div");
      label.className = "column-text";
      label.textContent = item.label;
      textColumn.appendChild(label);
    });
  })
  .catch((error) => console.error("Lỗi fetch:", error));
