import { render, screen } from "@testing-library/react";
import Welcome from "./index";

test("should render", () => {
  render(<Welcome setChangeUser={() => {}} setUserSubmitted={() => {}} />);
  const containerElement = screen.getByTestId("welcomeContainer");
  expect(containerElement).toBeInTheDocument();
});

test("Login action. Should show error message if nickname input is not filled", async () => {
  render(<Welcome setChangeUser={() => {}} setUserSubmitted={() => {}} />);
  const submit = screen.getByTestId("submit");
  const error = screen.getByTestId("error");
  await submit.click();
  expect(error).toHaveTextContent("name can't be blank");
});
