import { publishEvent } from "../events/producers/sampleProducer";

export const testController = async (req, res) => {
  publishEvent("TEST_EVENT", { message: "Hello Event Driven" });
  res.send({ status: "Event sent" });
};