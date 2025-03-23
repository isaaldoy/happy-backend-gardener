
/**
 * Utility function to run Python code in Deno
 */
export async function runPythonScript(
  pythonCode: string,
  args: string[] = []
): Promise<string> {
  // Create a temporary Python file with a unique name in the /tmp directory
  // which is the standard writable temp directory in most environments
  const encoder = new TextEncoder();
  const tempDir = "/tmp";
  const tempFileName = `${tempDir}/py_script_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.py`;
  
  console.log(`Writing Python script to temporary file: ${tempFileName}`);
  
  try {
    // Try to create the temp directory if it doesn't exist
    try {
      await Deno.mkdir(tempDir, { recursive: true });
      console.log(`Ensured temp directory exists: ${tempDir}`);
    } catch (dirError) {
      // If directory already exists or can't be created, log but continue
      console.warn(`Note about temp directory: ${dirError.message}`);
    }
    
    // Write the Python script to the temporary file
    try {
      await Deno.writeFile(tempFileName, encoder.encode(pythonCode));
      console.log("Successfully wrote Python script to temporary file");
    } catch (writeError) {
      console.error(`Error writing to temporary file: ${writeError.message}`);
      throw new Error(`Failed to write Python script: ${writeError.message}`);
    }
    
    // Build the command to run Python with the script and any arguments
    const cmd = ["python3", tempFileName, ...args];
    console.log(`Executing Python command: ${cmd.join(' ')}`);
    
    // Execute the Python script
    const process = Deno.run({
      cmd: cmd,
      stdout: "piped",
      stderr: "piped",
    });

    // Get the output
    const [status, stdout, stderr] = await Promise.all([
      process.status(),
      process.output(),
      process.stderrOutput(),
    ]);
    process.close();

    // Log execution details for debugging
    console.log(`Python execution completed with status: ${status.success ? "success" : "failure"}`);
    
    if (!status.success) {
      const errorString = new TextDecoder().decode(stderr);
      console.error("Python execution error:", errorString);
      throw new Error(`Python execution failed: ${errorString}`);
    }

    const result = new TextDecoder().decode(stdout);
    console.log("Python script executed successfully");
    
    return result;
  } catch (e) {
    console.error("Error in runPythonScript:", e);
    throw e;
  } finally {
    // Clean up the temporary file
    try {
      await Deno.remove(tempFileName);
      console.log(`Successfully removed temporary file: ${tempFileName}`);
    } catch (e) {
      console.error(`Error removing temporary file ${tempFileName}:`, e);
      // Continue execution even if cleanup fails
    }
  }
}
