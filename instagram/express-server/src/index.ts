import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use("/api", routes);

const PORT = Bun.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is up and running on port ${PORT}`);
});